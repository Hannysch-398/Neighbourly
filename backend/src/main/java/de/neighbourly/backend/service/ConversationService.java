package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.ConversationParticipantResponse;
import de.neighbourly.backend.dto.ConversationResponse;
import de.neighbourly.backend.dto.CreateConversationRequest;
import de.neighbourly.backend.dto.MessageResponse;
import de.neighbourly.backend.entity.Conversation;
import de.neighbourly.backend.entity.ConversationParticipant;
import de.neighbourly.backend.entity.Message;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.repository.ConversationParticipantRepository;
import de.neighbourly.backend.repository.ConversationRepository;
import de.neighbourly.backend.repository.MessageRepository;
import de.neighbourly.backend.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import de.neighbourly.backend.dto.CreateMessageRequest;

import java.util.List;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final ConversationParticipantRepository conversationParticipantRepository;

    public ConversationService(
            ConversationRepository conversationRepository,
            UserRepository userRepository,
            MessageRepository messageRepository,
            ConversationParticipantRepository conversationParticipantRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.conversationParticipantRepository = conversationParticipantRepository;
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

    public Page<MessageResponse> getConversationMessages(
            Long conversationId,
            int page,
            int size,
            String email
    ) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));

        boolean isParticipant =
                conversationParticipantRepository.existsByConversationIdAndUserId(
                        conversationId,
                        currentUser.getId()
                );

        if (!isParticipant) {
            throw new IllegalArgumentException("User is not a participant of this conversation");
        }

        Pageable pageable = PageRequest.of(page, size);

        return messageRepository
                .findByConversationIdOrderByCreatedAtAsc(conversationId, pageable)
                .map(this::mapMessageToResponse);
    }

    private MessageResponse mapMessageToResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getConversation().getId(),
                message.getSender().getId(),
                message.getSender().getUsername(),
                message.getContent(),
                message.getCreatedAt()
        );
    }

    public MessageResponse sendMessage(
            Long conversationId,
            CreateMessageRequest request,
            String email
    ) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));

        boolean isParticipant =
                conversationParticipantRepository.existsByConversationIdAndUserId(
                        conversationId,
                        currentUser.getId()
                );

        if (!isParticipant) {
            throw new IllegalArgumentException("User is not a participant of this conversation");
        }

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(currentUser);
        message.setContent(request.getContent().trim());

        Message savedMessage = messageRepository.save(message);

        conversation.setUpdatedAt(savedMessage.getCreatedAt());
        conversationRepository.save(conversation);

        return mapMessageToResponse(savedMessage);
    }

}