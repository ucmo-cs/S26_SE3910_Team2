package com.ucm.appointmentsetting.controller;

import com.ucm.appointmentsetting.dto.AppointmentRequest;
import com.ucm.appointmentsetting.entity.Appointment;
import com.ucm.appointmentsetting.entity.Branch;
import com.ucm.appointmentsetting.entity.Topic;
import com.ucm.appointmentsetting.repository.AppointmentRepository;
import com.ucm.appointmentsetting.repository.BranchRepository;
import com.ucm.appointmentsetting.repository.TopicRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final TopicRepository topicRepository;
    private final BranchRepository branchRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository,
            TopicRepository topicRepository,
            BranchRepository branchRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.topicRepository = topicRepository;
        this.branchRepository = branchRepository;
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody AppointmentRequest request) {
        LocalDateTime dateTime = LocalDateTime.parse(request.getStartISO());
        LocalDate date = dateTime.toLocalDate();
        LocalTime time = dateTime.toLocalTime();

        boolean conflictExists = appointmentRepository.findAll().stream()
                .anyMatch(appointment ->
                        appointment.getBranch().getId().equals(request.getBranchId())
                                && appointment.getAppointmentDate().equals(date)
                                && appointment.getAppointmentTime().equals(time)
                );

        if (conflictExists) {
            return null;
        }

        Topic topic = topicRepository.findById(request.getTopicId()).orElse(null);
        Branch branch = branchRepository.findById(request.getBranchId()).orElse(null);

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
