package de.neighbourly.backend.dto;


import de.neighbourly.backend.model.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {

    @NotBlank(message = "Title must not be empty")
    private String title;

    @NotBlank(message = "Description must not be empty")
    private String description;

    @NotNull(message = "Type must not be null")
    private PostType type;
    private boolean isUrgent;
    private LocalDateTime urgentUntil;
    public boolean getIsUrgent() {
        return isUrgent;
    }
}
