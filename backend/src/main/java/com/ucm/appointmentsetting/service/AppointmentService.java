package com.ucm.appointmentsetting.service;

import com.ucm.appointmentsetting.dto.AppointmentRequest;
import com.ucm.appointmentsetting.dto.AppointmentSummaryResponse;
import com.ucm.appointmentsetting.dto.AppointmentUpdateRequest;
import com.ucm.appointmentsetting.entity.Appointment;
import com.ucm.appointmentsetting.entity.Branch;
import com.ucm.appointmentsetting.entity.BranchSchedule;
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

import java.time.DateTimeException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

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
        Branch branch = branchRepository.findById(request.getBranchId()).orElse(null);
        LocalDateTime dateTime = parseAndValidateAppointmentTime(request.getStartISO(), branch);
        LocalDate date = dateTime.toLocalDate();
        LocalTime time = dateTime.toLocalTime();

        boolean conflictExists = appointmentRepository.existsByBranchIdAndAppointmentDateAndAppointmentTime(
                request.getBranchId(),
                date,
                time
        );
        if (conflictExists) {
            throw new SlotUnavailableException("Slot unavailable");
        }

        Topic topic = topicRepository.findById(request.getTopicId()).orElse(null);
        Branch branch2 = branchRepository.findById(request.getBranchId()).orElse(null);
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found."));
        }
        if (topic == null || branch2 == null || branch2.getTopics() == null || !branch2.getTopics().contains(topic)) {
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

    public Appointment updateAppointment(Long appointmentId, AppointmentUpdateRequest request) {
        if (request.getActorUserId() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "An actor user is required.");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Appointment not found."));
        User actor = userRepository.findById(request.getActorUserId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found."));

        validateAccess(actor, appointment);

        LocalDateTime dateTime = parseAndValidateAppointmentTime(request.getStartISO(), appointment.getBranch());
        LocalDate date = dateTime.toLocalDate();
        LocalTime time = dateTime.toLocalTime();

        boolean conflictExists = appointmentRepository.existsByBranchIdAndAppointmentDateAndAppointmentTimeAndIdNot(
                appointment.getBranch().getId(),
                date,
                time,
                appointment.getId()
        );
        if (conflictExists) {
            throw new SlotUnavailableException("Slot unavailable");
        }

        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);

        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long appointmentId, Long actorUserId) {
        if (actorUserId == null) {
            throw new ResponseStatusException(BAD_REQUEST, "An actor user is required.");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Appointment not found."));
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found."));

        validateAccess(actor, appointment);
        appointmentRepository.delete(appointment);
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

    public List<String> getAvailableSlots(Long branchId, String dateISO) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Branch not found."));

        LocalDate date;
        try {
            date = LocalDate.parse(dateISO);
        } catch (DateTimeException ex) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid date format.");
        }

        BranchSchedule schedule = findScheduleForBranch(branch, date);
        LocalTime openingTime = schedule.getOpeningTime();
        LocalTime lastStartTime = schedule.getClosingTime().minusMinutes(30);
        LocalDateTime now = LocalDateTime.now();

        List<LocalTime> bookedTimes = appointmentRepository.findByBranchIdAndAppointmentDate(branchId, date)
                .stream()
                .map(Appointment::getAppointmentTime)
                .toList();

        List<String> availableSlots = new ArrayList<>();
        for (LocalTime current = openingTime; !current.isAfter(lastStartTime); current = current.plusMinutes(30)) {
            LocalDateTime candidate = LocalDateTime.of(date, current);
            if (!bookedTimes.contains(current) && !candidate.isBefore(now)) {
                availableSlots.add(candidate.toString());
            }
        }

        return availableSlots;
    }

    private BranchSchedule findScheduleForBranch(Branch branch, LocalDate date) {
        if (branch == null) {
            throw new ResponseStatusException(NOT_FOUND, "Branch not found.");
        }

        if (branch.getSchedules() == null || branch.getSchedules().isEmpty()) {
            throw new OutsideBusinessHoursException("Branch schedule is not available for the selected branch.");
        }

        return branch.getSchedules().stream()
                .filter(schedule -> schedule.getDayOfWeek() == date.getDayOfWeek())
                .findFirst()
                .orElseThrow(() -> new OutsideBusinessHoursException("Branch is closed on the selected date."));
    }

    private LocalDateTime parseAndValidateAppointmentTime(String startISO, Branch branch) {
        LocalDateTime dateTime = LocalDateTime.parse(startISO);
        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new PastAppointmentException("Cannot book an appointment in the past.");
        }

        BranchSchedule schedule = findScheduleForBranch(branch, dateTime.toLocalDate());
        LocalTime openingTime = schedule.getOpeningTime();
        LocalTime lastStartTime = schedule.getClosingTime().minusMinutes(30);
        LocalTime time = dateTime.toLocalTime();
        if (time.isBefore(openingTime) || time.isAfter(lastStartTime)) {
            throw new OutsideBusinessHoursException(String.format(
                    "Appointment time must be between %s and %s (last start).",
                    openingTime, lastStartTime
            ));
        }

        return dateTime;
    }

    private void validateAccess(User actor, Appointment appointment) {
        if ("BANKER".equalsIgnoreCase(actor.getRole())) {
            return;
        }

        if (appointment.getUser() != null && appointment.getUser().getId().equals(actor.getId())) {
            return;
        }

        throw new ResponseStatusException(FORBIDDEN, "You do not have access to modify this appointment.");
    }
}
