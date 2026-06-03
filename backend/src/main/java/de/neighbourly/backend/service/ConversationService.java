package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.ConversationParticipantResponse;
import de.neighbourly.backend.dto.ConversationResponse;
import de.neighbourly.backend.dto.CreateConversationRequest;
import de.neighbourly.backend.entity.Conversation;
import de.neighbourly.backend.entity.ConversationParticipant;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.repository.ConversationRepository;
import de.neighbourly.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public ConversationService(
            ConversationRepository conversationRepository,
            UserRepository userRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    public List<ConversationResponse> getOwnConversations(String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));

        return conversationRepository
                .findDistinctByParticipantsUserIdOrderByUpdatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ConversationResponse createConversation(CreateConversationRequest request, String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));

        User participantUser = userRepository.findById(request.getParticipantUserId())
                .orElseThrow(() -> new IllegalArgumentException("Participant user not found"));

        if (currentUser.getId().equals(participantUser.getId())) {
            throw new IllegalArgumentException("Cannot start conversation with yourself");
        }

        return conversationRepository
                .findDirectConversationBetweenUsers(currentUser.getId(), participantUser.getId())
                .map(this::mapToResponse)
                .orElseGet(() -> createNewConversation(currentUser, participantUser));
    }

    private ConversationResponse createNewConversation(User currentUser, User participantUser) {
        Conversation conversation = new Conversation();

        ConversationParticipant currentParticipant = new ConversationParticipant();
        currentParticipant.setConversation(conversation);
        currentParticipant.setUser(currentUser);

        ConversationParticipant targetParticipant = new ConversationParticipant();
        targetParticipant.setConversation(conversation);
        targetParticipant.setUser(participantUser);

        conversation.getParticipants().add(currentParticipant);
        conversation.getParticipants().add(targetParticipant);

        Conversation savedConversation = conversationRepository.save(conversation);

        return mapToResponse(savedConversation);
    }

    private ConversationResponse mapToResponse(Conversation conversation) {
        List<ConversationParticipantResponse> participants = conversation.getParticipants()
                .stream()
                .map(participant -> new ConversationParticipantResponse(
                        participant.getUser().getId(),
                        participant.getUser().getUsername()
                ))
                .toList();

        return new ConversationResponse(
                conversation.getId(),
                conversation.getCreatedAt(),
                conversation.getUpdatedAt(),
                participants
        );
    }
}