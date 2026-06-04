package de.neighbourly.backend.dto;


import com.fasterxml.jackson.databind.JsonNode;
import de.neighbourly.backend.model.PostMode;
import de.neighbourly.backend.model.PostType;
import jakarta.validation.Valid;
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

    @NotNull(message = "Post mode must not be null")
    private PostMode postMode;

    private boolean isUrgent;

    private LocalDateTime urgentUntil;

    @Valid
    private CreatePostLocationDto location;

    @Valid
    @NotNull(message = "Details must not be null")
    private PostDetailsDto details;

    public boolean getIsUrgent() {
        return isUrgent;
    }
}
