package com.ucm.appointmentsetting.exception;

public class OutsideBusinessHoursException extends RuntimeException {
    public OutsideBusinessHoursException() {
        super();
    }
    public OutsideBusinessHoursException(String message) {
        super(message);
    }
}
