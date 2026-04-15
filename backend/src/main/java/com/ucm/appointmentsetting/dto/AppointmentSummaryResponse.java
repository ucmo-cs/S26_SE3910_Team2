package com.ucm.appointmentsetting.dto;

import com.ucm.appointmentsetting.entity.Appointment;

public class AppointmentSummaryResponse {

    private Long id;
    private String fullName;
    private String email;
    private String appointmentDate;
    private String appointmentTime;
    private String notes;
    private Long topicId;
    private String topicName;
    private Long branchId;
    private String branchName;
    private String branchAddress;

    public AppointmentSummaryResponse() {
    }

    public AppointmentSummaryResponse(Appointment appointment) {
        this.id = appointment.getId();
        this.fullName = appointment.getFullName();
        this.email = appointment.getEmail();
        this.appointmentDate = appointment.getAppointmentDate().toString();
        this.appointmentTime = appointment.getAppointmentTime().toString();
        this.notes = appointment.getNotes();
        this.topicId = appointment.getTopic().getId();
        this.topicName = appointment.getTopic().getName();
        this.branchId = appointment.getBranch().getId();
        this.branchName = appointment.getBranch().getName();
        this.branchAddress = String.format(
                "%s, %s, %s %s",
                appointment.getBranch().getAddress(),
                appointment.getBranch().getCity(),
                appointment.getBranch().getState(),
                appointment.getBranch().getZip()
        );
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public String getNotes() {
        return notes;
    }

    public Long getTopicId() {
        return topicId;
    }

    public String getTopicName() {
        return topicName;
    }

    public Long getBranchId() {
        return branchId;
    }

    public String getBranchName() {
        return branchName;
    }

    public String getBranchAddress() {
        return branchAddress;
    }
}
