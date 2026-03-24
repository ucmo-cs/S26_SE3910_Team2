package com.commercebank.backend.health;

import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Validated
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> health(@RequestParam(defaultValue = "backend") @NotBlank String service) {
        return Map.of(
                "status", "ok",
                "service", service
        );
    }
}
