package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.ConversationResponse;
import de.neighbourly.backend.dto.CreateConversationRequest;
import de.neighbourly.backend.dto.CreateMessageRequest;
import de.neighbourly.backend.dto.MessageResponse;
import de.neighbourly.backend.service.ConversationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConversationControllerTest {

    @Mock
    private ConversationService conversationService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ConversationController conversationController;

    @Test
    void createConversation_shouldReturnCreatedConversation() {
        CreateConversationRequest request = new CreateConversationRequest();
        ConversationResponse expectedResponse = mock(ConversationResponse.class);

        when(authentication.getName()).thenReturn("test@example.com");
        when(conversationService.createConversation(request, "test@example.com"))
                .thenReturn(expectedResponse);

        ResponseEntity<ConversationResponse> response =
                conversationController.createConversation(request, authentication);

        verify(conversationService).createConversation(request, "test@example.com");

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).isEqualTo(expectedResponse);
    }

    @Test
    void getOwnConversations_shouldReturnConversationList() {
        ConversationResponse conversation1 = mock(ConversationResponse.class);
        ConversationResponse conversation2 = mock(ConversationResponse.class);
        List<ConversationResponse> expectedConversations =
                List.of(conversation1, conversation2);

        when(authentication.getName()).thenReturn("test@example.com");
        when(conversationService.getOwnConversations("test@example.com"))
                .thenReturn(expectedConversations);

        ResponseEntity<List<ConversationResponse>> response =
                conversationController.getOwnConversations(authentication);

        verify(conversationService).getOwnConversations("test@example.com");

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(expectedConversations);
    }

    @Test
    void getConversationMessages_shouldReturnMessagePage() {
        Long conversationId = 1L;
        int page = 0;
        int size = 20;

        MessageResponse message1 = mock(MessageResponse.class);
        MessageResponse message2 = mock(MessageResponse.class);

        Page<MessageResponse> expectedPage =
                new PageImpl<>(List.of(message1, message2));

        when(authentication.getName()).thenReturn("test@example.com");
        when(conversationService.getConversationMessages(
                conversationId,
                page,
                size,
                "test@example.com"
        )).thenReturn(expectedPage);

        ResponseEntity<Page<MessageResponse>> response =
                conversationController.getConversationMessages(
                        conversationId,
                        page,
                        size,
                        authentication
                );

        verify(conversationService).getConversationMessages(
                conversationId,
                page,
                size,
                "test@example.com"
        );

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(expectedPage);
    }

    @Test
    void sendMessage_shouldReturnCreatedMessage() {
        Long conversationId = 1L;
        CreateMessageRequest request = new CreateMessageRequest();
        MessageResponse expectedResponse = mock(MessageResponse.class);

        when(authentication.getName()).thenReturn("test@example.com");
        when(conversationService.sendMessage(conversationId, request, "test@example.com"))
                .thenReturn(expectedResponse);

        ResponseEntity<MessageResponse> response =
                conversationController.sendMessage(
                        conversationId,
                        request,
                        authentication
                );

        verify(conversationService).sendMessage(
                conversationId,
                request,
                "test@example.com"
        );

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).isEqualTo(expectedResponse);
    }
}