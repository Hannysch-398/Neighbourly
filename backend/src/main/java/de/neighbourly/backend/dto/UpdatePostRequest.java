package de.neighbourly.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class UpdatePostRequest {

    @NotBlank(message = "Title must not be empty")
    private String title;

    @NotBlank(message = "Description must not be empty")
    private String description;

    private boolean isUrgent;

    private LocalDateTime urgentUntil;

    public boolean getIsUrgent() {
        return isUrgent;
    }
}