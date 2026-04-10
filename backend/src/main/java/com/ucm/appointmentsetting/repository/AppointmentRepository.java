package com.ucm.appointmentsetting.repository;

import com.ucm.appointmentsetting.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByBranchIdAndAppointmentDateAndAppointmentTime(Long branchId, LocalDate appointmentDate, LocalTime appointmentTime);

    List<Appointment> findByUserIdOrderByAppointmentDateAscAppointmentTimeAsc(Long userId);

    List<Appointment> findByEmailIgnoreCaseAndUserIsNull(String email);
}
