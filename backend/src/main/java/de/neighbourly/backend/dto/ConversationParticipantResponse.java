package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConversationParticipantResponse {

    private Long userId;
    private String username;
}