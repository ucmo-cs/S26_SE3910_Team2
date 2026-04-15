package com.ucm.appointmentsetting.dto;

public class AppointmentUpdateRequest {

    private Long actorUserId;
    private String startISO;

    public AppointmentUpdateRequest() {
    }

    public Long getActorUserId() {
        return actorUserId;
    }

    public void setActorUserId(Long actorUserId) {
        this.actorUserId = actorUserId;
    }

    public String getStartISO() {
        return startISO;
    }

    public void setStartISO(String startISO) {
        this.startISO = startISO;
    }
}
