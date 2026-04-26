package com.ucm.appointmentsetting.controller;

import com.ucm.appointmentsetting.exception.InvalidTopicBranchException;
import com.ucm.appointmentsetting.exception.OutsideBusinessHoursException;
import com.ucm.appointmentsetting.exception.PastAppointmentException;
import com.ucm.appointmentsetting.exception.SlotUnavailableException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(SlotUnavailableException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public Map<String, String> handleSlotUnavailable(SlotUnavailableException ex) {
        return Map.of("message", ex.getMessage());
    }

    @ExceptionHandler({PastAppointmentException.class, InvalidTopicBranchException.class, OutsideBusinessHoursException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public Map<String, String> handleBadRequest(RuntimeException ex) {
        return Map.of("message", ex.getMessage());
    }
}
