package com.ucm.appointmentsetting.dto;

public class AppointmentRequest {

    private String name;
    private String email;
    private Long topicId;
    private Long branchId;
    private String startISO;
    private String reason;

    public AppointmentRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }

    public String getStartISO() {
        return startISO;
    }

    public void setStartISO(String startISO) {
        this.startISO = startISO;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
