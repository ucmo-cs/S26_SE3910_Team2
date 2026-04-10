package com.ucm.appointmentsetting.controller;

import com.ucm.appointmentsetting.dto.AppointmentSummaryResponse;
import com.ucm.appointmentsetting.dto.UserLoginRequest;
import com.ucm.appointmentsetting.dto.UserResponse;
import com.ucm.appointmentsetting.dto.UserSignupRequest;
import com.ucm.appointmentsetting.service.AppointmentService;
import com.ucm.appointmentsetting.service.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AppointmentService appointmentService;

    public UserController(UserService userService, AppointmentService appointmentService) {
        this.userService = userService;
        this.appointmentService = appointmentService;
    }

    @PostMapping("/signup")
    public UserResponse signup(@RequestBody UserSignupRequest request) {
        return new UserResponse(userService.register(request));
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody UserLoginRequest request) {
        return new UserResponse(userService.authenticate(request));
    }

    @PostMapping("/banker-login")
    public UserResponse bankerLogin(@RequestBody UserLoginRequest request) {
        return new UserResponse(userService.authenticateBanker(request));
    }

    @GetMapping("/{userId}/appointments")
    public List<AppointmentSummaryResponse> getAppointments(@PathVariable Long userId) {
        return appointmentService.getAppointmentsForUser(userId);
    }

    @GetMapping("/{userId}/banker-appointments")
    public List<AppointmentSummaryResponse> getBankerAppointments(@PathVariable Long userId) {
        return appointmentService.getAllAppointmentsForBanker(userId);
    }
}
