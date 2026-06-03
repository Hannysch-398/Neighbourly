package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.ConversationResponse;
import de.neighbourly.backend.dto.CreateConversationRequest;
import de.neighbourly.backend.service.ConversationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping
    public ResponseEntity<ConversationResponse> createConversation(
            @Valid @RequestBody CreateConversationRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        ConversationResponse response =
                conversationService.createConversation(request, email);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getOwnConversations(
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(conversationService.getOwnConversations(email));
    }

}