package com.ucm.appointmentsetting.dto;

public class AppointmentBookingResponse {

    private Long id;
    private Long appointmentId;
    private String email;
    private boolean emailSent;

    public AppointmentBookingResponse(Long appointmentId, String email, boolean emailSent) {
        this.id = appointmentId;
        this.appointmentId = appointmentId;
        this.email = email;
        this.emailSent = emailSent;
    }

    public Long getId() {
        return id;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public String getEmail() {
        return email;
    }

    public boolean isEmailSent() {
        return emailSent;
    }
}
