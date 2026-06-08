package de.neighbourly.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMessageRequest {

    @NotBlank(message = "Message content must not be empty")
    @Size(max = 2000, message = "Message content must not exceed 2000 characters")
    private String content;
}