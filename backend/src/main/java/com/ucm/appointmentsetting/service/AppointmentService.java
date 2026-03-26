package com.ucm.appointmentsetting.service;

import com.ucm.appointmentsetting.dto.AppointmentRequest;
import com.ucm.appointmentsetting.entity.Appointment;
import com.ucm.appointmentsetting.entity.Branch;
import com.ucm.appointmentsetting.entity.Topic;
import com.ucm.appointmentsetting.repository.AppointmentRepository;
import com.ucm.appointmentsetting.repository.BranchRepository;
import com.ucm.appointmentsetting.repository.TopicRepository;
import com.ucm.appointmentsetting.exception.PastAppointmentException;
import com.ucm.appointmentsetting.exception.OutsideBusinessHoursException;
import com.ucm.appointmentsetting.exception.SlotUnavailableException;
import com.ucm.appointmentsetting.exception.InvalidTopicBranchException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final TopicRepository topicRepository;
    private final BranchRepository branchRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              TopicRepository topicRepository,
                              BranchRepository branchRepository) {
        this.appointmentRepository = appointmentRepository;
        this.topicRepository = topicRepository;
        this.branchRepository = branchRepository;
    }

    public Appointment bookAppointment(AppointmentRequest request) {
        LocalDateTime dateTime = LocalDateTime.parse(request.getStartISO());
        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new PastAppointmentException("Cannot book an appointment in the past.");
        }

        LocalDate date = dateTime.toLocalDate();
        LocalTime time = dateTime.toLocalTime();
        LocalTime open = LocalTime.of(9, 0);
        LocalTime last = LocalTime.of(16, 30);
        if (time.isBefore(open) || time.isAfter(last)) {
            throw new OutsideBusinessHoursException("Appointment time must be between 09:00 and 16:30.");
        }

        boolean conflictExists = appointmentRepository.findAll().stream()
            .anyMatch(appointment ->
                appointment.getBranch().getId().equals(request.getBranchId())
                    && appointment.getAppointmentDate().equals(date)
                    && appointment.getAppointmentTime().equals(time)
            );
        if (conflictExists) {
            throw new SlotUnavailableException("Slot unavailable");
        }

        Topic topic = topicRepository.findById(request.getTopicId()).orElse(null);
        Branch branch = branchRepository.findById(request.getBranchId()).orElse(null);
        if (topic == null || branch == null || branch.getTopics() == null || !branch.getTopics().contains(topic)) {
            throw new InvalidTopicBranchException("Selected topic is not available at the chosen branch.");
        }

        Appointment appointment = new Appointment();
        appointment.setFullName(request.getName());
        appointment.setEmail(request.getEmail());
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setNotes(request.getReason());
        appointment.setTopic(topic);
        appointment.setBranch(branch);

        return appointmentRepository.save(appointment);
    }
}
