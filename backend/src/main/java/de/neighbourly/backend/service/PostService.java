package de.neighbourly.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.neighbourly.backend.dto.*;
import de.neighbourly.backend.entity.*;
import de.neighbourly.backend.mapper.PostMapper;
import de.neighbourly.backend.model.PostType;
import de.neighbourly.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final SkillDetailRepository skillDetailRepository;
    private final PostLocationRepository postLocationRepository;
    private final PostTagRepository postTagRepository;
    private final PostImageRepository postImageRepository;
    private final ObjectMapper objectMapper;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            EventRepository eventRepository,
            SkillDetailRepository skillDetailRepository,
            PostLocationRepository postLocationRepository,
            PostTagRepository postTagRepository,
            PostImageRepository postImageRepository,
            ObjectMapper objectMapper
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.skillDetailRepository = skillDetailRepository;
        this.postLocationRepository = postLocationRepository;
        this.postTagRepository = postTagRepository;
        this.postImageRepository = postImageRepository;
        this.objectMapper = objectMapper;
    }

    public PostResponseDto createPost(CreatePostRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateTypeSpecificDetails(request);


        if (!request.getIsUrgent() && request.getUrgentUntil() != null) {
            throw new IllegalArgumentException("urgentUntil is only allowed when isUrgent is true");
        }

        Post post = PostMapper.toEntity(request, user);

        LocalDateTime now = LocalDateTime.now();
        post.setCreatedAt(now);
        post.setUpdatedAt(now);

        Post savedPost = postRepository.save(post);
        saveTypeSpecificDetails(request, savedPost);
        return PostMapper.toDto(savedPost);
    }

    public PostDetailResponseDto getPostDetail(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Object details = buildDetailsBlock(post);

        LocationDto location = postLocationRepository.findByPostId(postId)
                .map(this::mapLocation)
                .orElse(null);

        List<String> tags = postTagRepository.findAllByPostId(postId)
                .stream()
                .map(PostTag::getName)
                .toList();

        List<PostImageDto> images = postImageRepository.findAllByPostIdOrderByOrderIndexAsc(postId)
                .stream()
                .map(this::mapImage)
                .toList();

        return PostMapper.toDetailDto(post, location, tags, images, details);
    }

    private void validateTypeSpecificDetails(CreatePostRequest request) {
        if (request.getType() == PostType.EVENT) {
            EventDetailsDto details = getEventDetails(request);

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
        if (request.getType() == PostType.SKILL) {
            SkillDetailsDto details = getSkillDetails(request);

            if (details == null) {
                throw new IllegalArgumentException("Skill details are required");
            }

            if (details.getSkillTags() == null || details.getSkillTags().isEmpty()) {
                throw new IllegalArgumentException("skillTags are required");
            }

            if (details.getAvailabilityNote() == null || details.getAvailabilityNote().isBlank()) {
                throw new IllegalArgumentException("availabilityNote is required");
            }

            if (details.getExperienceLevel() == null || details.getExperienceLevel().isBlank()) {
                throw new IllegalArgumentException("experienceLevel is required");
            }
        }
    }

    private void saveTypeSpecificDetails(CreatePostRequest request, Post savedPost) {
        if (request.getType() == PostType.EVENT) {
            EventDetailsDto details = getEventDetails(request);

            Event event = new Event();
            event.setPost(savedPost);
            event.setStartDate(details.getStartDate());
            event.setEndDate(details.getEndDate());
            event.setVenue(details.getVenue());

            eventRepository.save(event);
        }

        if (request.getType() == PostType.SKILL) {
            SkillDetailsDto details = getSkillDetails(request);

            SkillDetail skillDetail = new SkillDetail();
            skillDetail.setPost(savedPost);
            skillDetail.setSkillTags(String.join(",", details.getSkillTags()));
            skillDetail.setAvailabilityNote(details.getAvailabilityNote());
            skillDetail.setExperienceLevel(details.getExperienceLevel());

            skillDetailRepository.save(skillDetail);
        }
    }

    private Object buildDetailsBlock(Post post) {
        return switch (post.getType()) {
            case EVENT -> new EventDetailsDto(null, null, null);
            case SKILL -> new SkillDetailsDto(null, null, null);
            case PRODUCT -> new ProductDetailsDto(null, null);
            case HOUSING -> new HousingDetailsDto(null, null);
        };
    }

    private LocationDto mapLocation(PostLocation location) {
        return new LocationDto(
                location.getCity(),
                location.getDistrict(),
                location.getLatitude(),
                location.getLongitude()
        );
    }

    private PostImageDto mapImage(PostImage image) {
        return new PostImageDto(
                image.getId(),
                image.getUrl(),
                image.getAltText()
        );
    }

    private EventDetailsDto getEventDetails(CreatePostRequest request) {
        return objectMapper.convertValue(request.getDetails(), EventDetailsDto.class);
    }

    private SkillDetailsDto getSkillDetails(CreatePostRequest request) {
        return objectMapper.convertValue(request.getDetails(), SkillDetailsDto.class);
    }
}