package com.ucm.appointmentsetting.service;

import com.ucm.appointmentsetting.dto.AppointmentRequest;
import com.ucm.appointmentsetting.dto.AppointmentSummaryResponse;
import com.ucm.appointmentsetting.entity.Appointment;
import com.ucm.appointmentsetting.entity.Branch;
import com.ucm.appointmentsetting.entity.Topic;
import com.ucm.appointmentsetting.entity.User;
import com.ucm.appointmentsetting.repository.AppointmentRepository;
import com.ucm.appointmentsetting.repository.BranchRepository;
import com.ucm.appointmentsetting.repository.TopicRepository;
import com.ucm.appointmentsetting.repository.UserRepository;
import com.ucm.appointmentsetting.exception.PastAppointmentException;
import com.ucm.appointmentsetting.exception.OutsideBusinessHoursException;
import com.ucm.appointmentsetting.exception.SlotUnavailableException;
import com.ucm.appointmentsetting.exception.InvalidTopicBranchException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.FORBIDDEN;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final TopicRepository topicRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              TopicRepository topicRepository,
                              BranchRepository branchRepository,
                              UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.topicRepository = topicRepository;
        this.branchRepository = branchRepository;
        this.userRepository = userRepository;
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

        boolean conflictExists = appointmentRepository.existsByBranchIdAndAppointmentDateAndAppointmentTime(
                request.getBranchId(),
                date,
                time
        );
        if (conflictExists) {
            throw new SlotUnavailableException("Slot unavailable");
        }

        Topic topic = topicRepository.findById(request.getTopicId()).orElse(null);
        Branch branch = branchRepository.findById(request.getBranchId()).orElse(null);
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found."));
        }
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
        appointment.setUser(user);

        return appointmentRepository.save(appointment);
    }

    public List<AppointmentSummaryResponse> getAppointmentsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found."));

        return appointmentRepository.findByUserIdOrderByAppointmentDateAscAppointmentTimeAsc(user.getId())
                .stream()
                .map(AppointmentSummaryResponse::new)
                .toList();
    }

    public List<AppointmentSummaryResponse> getAllAppointmentsForBanker(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found."));

        if (!"BANKER".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(FORBIDDEN, "Banker access is required.");
        }

        return appointmentRepository.findAll().stream()
                .sorted((left, right) -> {
                    LocalDateTime leftDateTime = LocalDateTime.of(left.getAppointmentDate(), left.getAppointmentTime());
                    LocalDateTime rightDateTime = LocalDateTime.of(right.getAppointmentDate(), right.getAppointmentTime());
                    return leftDateTime.compareTo(rightDateTime);
                })
                .map(AppointmentSummaryResponse::new)
                .toList();
    }
}
