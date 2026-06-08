package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.ConversationResponse;
import de.neighbourly.backend.dto.CreateConversationRequest;
import de.neighbourly.backend.dto.CreateMessageRequest;
import de.neighbourly.backend.dto.MessageResponse;
import de.neighbourly.backend.service.ConversationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<Page<MessageResponse>> getConversationMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                conversationService.getConversationMessages(
                        conversationId,
                        page,
                        size,
                        email
                )
        );
    }
    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long conversationId,
            @Valid @RequestBody CreateMessageRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        MessageResponse response =
                conversationService.sendMessage(conversationId, request, email);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}