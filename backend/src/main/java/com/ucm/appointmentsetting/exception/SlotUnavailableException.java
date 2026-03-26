package com.ucm.appointmentsetting.exception;

public class SlotUnavailableException extends RuntimeException {
    public SlotUnavailableException() {
        super();
    }
    public SlotUnavailableException(String message) {
        super(message);
    }
}
