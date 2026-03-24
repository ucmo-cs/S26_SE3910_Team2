package com.ucm.appointmentsetting.repository;

import com.ucm.appointmentsetting.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
