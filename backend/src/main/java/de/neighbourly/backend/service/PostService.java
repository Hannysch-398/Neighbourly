package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.*;
import de.neighbourly.backend.entity.Event;
import de.neighbourly.backend.entity.Post;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.mapper.PostMapper;
import de.neighbourly.backend.model.PostType;
import de.neighbourly.backend.repository.EventRepository;
import de.neighbourly.backend.repository.PostRepository;
import de.neighbourly.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository, EventRepository eventRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    public PostResponseDto createPost(CreatePostRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (request.getType() == PostType.EVENT) {

            EventDetailsDto details = request.getDetails();

            if (details == null) {
                throw new IllegalArgumentException("Event details are required");
            }

            if (details.getStartDate() == null) {
                throw new IllegalArgumentException("startDate is required");
            }

            if (details.getEndDate() == null) {
                throw new IllegalArgumentException("endDate is required");
            }

            if (details.getVenue() == null || details.getVenue().isBlank()) {
                throw new IllegalArgumentException("venue is required");
            }
        }

        if (!request.getIsUrgent() && request.getUrgentUntil() != null) {
            throw new IllegalArgumentException("urgentUntil is only allowed when isUrgent is true");
        }

        Post post = PostMapper.toEntity(request, user);

        LocalDateTime now = LocalDateTime.now();
        post.setCreatedAt(now);
        post.setUpdatedAt(now);

        Post savedPost = postRepository.save(post);

        if (request.getType() == PostType.EVENT) {

            EventDetailsDto details = request.getDetails();

            Event event = new Event();

            event.setPost(savedPost);
            event.setStartDate(details.getStartDate());
            event.setEndDate(details.getEndDate());
            event.setVenue(details.getVenue());

            eventRepository.save(event);
        }

        return PostMapper.toDto(savedPost);

    }

    public PostDetailResponseDto getPostDetail(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Object details = buildDetailsBlock(post);

        return PostMapper.toDetailDto(post, details);
    }

    private Object buildDetailsBlock(Post post) {
        return switch (post.getType()) {
            case EVENT -> new EventDetailsDto(
                    null,
                    null,
                    null
            );
            case SKILL -> new SkillDetailsDto(
                    null,
                    null
            );
            case PRODUCT -> new ProductDetailsDto(
                    null,
                    null
            );
            case HOUSING -> new HousingDetailsDto(
                    null,
                    null
            );
        };
    }
}