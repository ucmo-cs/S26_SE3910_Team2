package com.ucm.appointmentsetting.controller;

import com.ucm.appointmentsetting.dto.AppointmentRequest;
import com.ucm.appointmentsetting.dto.AppointmentSummaryResponse;
import com.ucm.appointmentsetting.dto.AppointmentUpdateRequest;
import com.ucm.appointmentsetting.entity.Appointment;
import com.ucm.appointmentsetting.repository.AppointmentRepository;
import com.ucm.appointmentsetting.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;

    public AppointmentController(AppointmentService appointmentService, AppointmentRepository appointmentRepository) {
        this.appointmentService = appointmentService;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/{id}")
    public Appointment getAppointment(@PathVariable Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        Appointment appointment = appointmentService.bookAppointment(request);
        if (appointment == null) {
            return ResponseEntity.status(409).build();
        }
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/available-slots") 
    public List<String> getAvailableSlots(@RequestParam Long branchId, @RequestParam String dateISO) { 
        return appointmentService.getAvailableSlots(branchId, dateISO);
     }
     
    @PutMapping("/{id}")
    public ResponseEntity<AppointmentSummaryResponse> updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentUpdateRequest request
    ) {
        return ResponseEntity.ok(new AppointmentSummaryResponse(appointmentService.updateAppointment(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id, @RequestParam Long actorUserId) {
        appointmentService.deleteAppointment(id, actorUserId);
        return ResponseEntity.noContent().build();
    }
}
