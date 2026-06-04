package de.neighbourly.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateConversationRequest {

    @NotNull(message = "Post id must not be null")
    private Long postId;
}