package com.ucm.appointmentsetting.controller;

import com.ucm.appointmentsetting.entity.Appointment;
import com.ucm.appointmentsetting.repository.AppointmentRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final AppointmentRepository appointmentRepository;

    public AvailabilityController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    public List<String> getAvailability(@RequestParam Long branchId, @RequestParam String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(17, 0);

        List<LocalTime> allSlots = start.until(end, java.time.temporal.ChronoUnit.MINUTES) == 0
                ? List.of()
                : java.util.stream.Stream.iterate(start, time -> time.isBefore(end), time -> time.plusMinutes(30))
                .toList();

        Set<LocalTime> bookedTimes = appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.getBranch().getId().equals(branchId))
                .filter(appointment -> appointment.getAppointmentDate().equals(appointmentDate))
                .map(Appointment::getAppointmentTime)
                .collect(java.util.stream.Collectors.toSet());

        return allSlots.stream()
                .filter(time -> !bookedTimes.contains(time))
                .map(time -> time.format(DateTimeFormatter.ofPattern("HH:mm")))
                .toList();
    }
}
