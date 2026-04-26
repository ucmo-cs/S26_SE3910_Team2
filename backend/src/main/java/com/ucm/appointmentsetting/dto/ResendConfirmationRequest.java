package com.ucm.appointmentsetting.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ResendConfirmationRequest {

    @NotBlank
    @Email
    private String email;

    public ResendConfirmationRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
