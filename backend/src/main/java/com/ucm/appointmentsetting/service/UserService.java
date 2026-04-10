package com.ucm.appointmentsetting.service;

import com.ucm.appointmentsetting.dto.UserLoginRequest;
import com.ucm.appointmentsetting.dto.UserSignupRequest;
import com.ucm.appointmentsetting.entity.Appointment;
import com.ucm.appointmentsetting.entity.User;
import com.ucm.appointmentsetting.repository.AppointmentRepository;
import com.ucm.appointmentsetting.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public User register(UserSignupRequest request) {
        String fullName = normalize(request.getFullName());
        String phoneNumber = normalize(request.getPhoneNumber());
        String email = normalize(request.getEmail()).toLowerCase();
        String username = normalize(request.getUsername()).toLowerCase();
        String password = request.getPassword() == null ? "" : request.getPassword().trim();

        if (fullName.isEmpty() || phoneNumber.isEmpty() || email.isEmpty() || username.isEmpty() || password.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "All fields are required.");
        }

        if (password.length() < 8) {
            throw new ResponseStatusException(BAD_REQUEST, "Password must be at least 8 characters.");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(BAD_REQUEST, "An account with that email already exists.");
        }

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(BAD_REQUEST, "That username is already taken.");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setPhoneNumber(phoneNumber);
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);
        attachExistingAppointments(savedUser);
        return savedUser;
    }

    public User authenticate(UserLoginRequest request) {
        String username = normalize(request.getUsername()).toLowerCase();
        String password = request.getPassword() == null ? "" : request.getPassword();

        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid username or password."));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid username or password.");
        }

        attachExistingAppointments(user);
        return user;
    }

    private void attachExistingAppointments(User user) {
        List<Appointment> matchingAppointments = appointmentRepository.findByEmailIgnoreCaseAndUserIsNull(user.getEmail());
        if (matchingAppointments.isEmpty()) {
            return;
        }

        for (Appointment appointment : matchingAppointments) {
            appointment.setUser(user);
        }

        appointmentRepository.saveAll(matchingAppointments);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
