package com.ucm.appointmentsetting.dto;

import com.ucm.appointmentsetting.entity.User;

public class UserResponse {

    private Long id;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String username;

    public UserResponse() {
    }

    public UserResponse(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.phoneNumber = user.getPhoneNumber();
        this.email = user.getEmail();
        this.username = user.getUsername();
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }
}
