package com.ucm.appointmentsetting.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(PastAppointmentException.class)
    public ResponseEntity<String> handlePastAppointment(PastAppointmentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(OutsideBusinessHoursException.class)
    public ResponseEntity<String> handleOutsideBusinessHours(OutsideBusinessHoursException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidTopicBranchException.class)
    public ResponseEntity<String> handleInvalidTopicBranch(InvalidTopicBranchException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(ex.getMessage());
    }

    @ExceptionHandler(SlotUnavailableException.class)
    public ResponseEntity<String> handleSlotUnavailable(SlotUnavailableException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
}
