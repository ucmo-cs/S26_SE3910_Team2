package com.ucm.appointmentsetting.service;

import com.ucm.appointmentsetting.entity.Appointment;
import com.ucm.appointmentsetting.entity.Branch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class AppointmentEmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AppointmentEmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public AppointmentEmailService(JavaMailSender mailSender, @Value("${app.mail.from}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public boolean sendConfirmationEmail(Appointment appointment, String email) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(email);
            message.setSubject("Commerce Bank appointment confirmation");
            message.setText(buildEmailText(appointment));
            mailSender.send(message);
            return true;
        } catch (MailException | IllegalArgumentException ex) {
            LOGGER.warn("Appointment confirmation email could not be sent to {}: {}", email, ex.getMessage());
            return false;
        }
    }

    private String buildEmailText(Appointment appointment) {
        Branch branch = appointment.getBranch();

        return String.join(System.lineSeparator(),
                "Your Commerce Bank appointment is confirmed.",
                "",
                "Appointment date: " + appointment.getAppointmentDate(),
                "Appointment time: " + appointment.getAppointmentTime(),
                "Branch name: " + branch.getName(),
                "Branch address: " + formatBranchAddress(branch)
        );
    }

    private String formatBranchAddress(Branch branch) {
        return String.format(
                "%s, %s, %s %s",
                branch.getAddress(),
                branch.getCity(),
                branch.getState(),
                branch.getZip()
        );
    }
}
