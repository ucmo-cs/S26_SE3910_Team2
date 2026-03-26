package com.ucm.appointmentsetting.exception;

public class PastAppointmentException extends RuntimeException {
    public PastAppointmentException() {
        super();
    }
    public PastAppointmentException(String message) {
        super(message);
    }
}
