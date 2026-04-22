package com.ucm.appointmentsetting.dto;

public class UserLoginRequest {

    private String username;
    private String password;

    public UserLoginRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
