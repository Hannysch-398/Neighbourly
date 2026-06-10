package de.neighbourly.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdatePostRequestDto {
    @NotBlank(message = "Titel must not be empty")
    private String title;
    @NotBlank(message = "Description must not be empty")
    private String description;

    @JsonProperty("isUrgent")
    private boolean isUrgent;
    private LocalDateTime urgentUntil;
}
