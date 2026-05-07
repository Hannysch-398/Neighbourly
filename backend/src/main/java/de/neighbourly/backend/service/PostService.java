

package de.neighbourly.backend.service;

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
    private final PostLocationRepository postLocationRepository;
    private final PostTagRepository postTagRepository;
    private final PostImageRepository postImageRepository;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            EventRepository eventRepository,
            PostLocationRepository postLocationRepository,
            PostTagRepository postTagRepository,
            PostImageRepository postImageRepository
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.postLocationRepository = postLocationRepository;
        this.postTagRepository = postTagRepository;
        this.postImageRepository = postImageRepository;
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

    public List<PostListItemResponseDto> getPostList() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostMapper::toListDto)
                .toList();
    }

    private Object buildDetailsBlock(Post post) {
        return switch (post.getType()) {
            case EVENT -> new EventDetailsDto(null, null, null);
            case SKILL -> new SkillDetailsDto(null, null);
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

        public List<MapDTO> getMapPosts(double lat, double lng, double radius) {
        // Contract: Es werden nur Posts mit status=ACTIVE zurückgegeben.
        // Contract: Bei precision=RADIUS werden lat/lng nur maskiert geliefert.
        // TODO: Sobald echte Post-Entity/Repository verfügbar ist, hier technisch filtern und maskieren.
        return List.of(new MapDTO(1L, "HELP_REQUEST", "Unterstützung gesucht", 52.52, 13.405, true, Instant.now()));
    }


    // public PostResponseDto createPost(CreatePostRequest request, String email) {
    //     User user = userRepository.findByEmail(email)
    //             .orElseThrow(() -> new RuntimeException("User not found"));

    //     if (!request.getIsUrgent() && request.getUrgentUntil() != null) {
    //         throw new IllegalArgumentException("urgentUntil is only allowed when isUrgent is true");
    //     }

    //     Post post = PostMapper.toEntity(request, user);

    //     LocalDateTime now = LocalDateTime.now();
    //     post.setCreatedAt(now);
    //     post.setUpdatedAt(now);

    //     Post savedPost = postRepository.save(post);

    //     return PostMapper.toDto(savedPost);

    // }

    // public PostDetailResponseDto getPostDetail(Long postId) {
    //     Post post = postRepository.findById(postId)
    //             .orElseThrow(() -> new RuntimeException("Post not found"));

    //     Object details = buildDetailsBlock(post);

    //     return PostMapper.toDetailDto(post, details);
    // }



    //     public List<MapDTO> getMapPosts(double lat, double lng, double radius) {
    //     // Contract: Es werden nur Posts mit status=ACTIVE zurückgegeben.
    //     // Contract: Bei precision=RADIUS werden lat/lng nur maskiert geliefert.
    //     // TODO: Sobald echte Post-Entity/Repository verfügbar ist, hier technisch filtern und maskieren.
    //     return List.of(new MapDTO(1L, "HELP_REQUEST", "Unterstützung gesucht", 52.52, 13.405, true, Instant.now()));
    // }



     public List<MapPostMarkerDto> getMapPostMarkers(double lat, double lng, double radius) {
        // Contract:
        // - Es werden nur Posts mit status=ACTIVE zurückgegeben.
        // - Bei precision=RADIUS werden lat/lng nur maskiert geliefert.
        // - isSponsored ist temporär/mockbar, falls Sponsoring noch nicht im Modell existiert.
        //
        // TODO: Sobald echte Post-Entity/Repository verfügbar ist:
        // - nach status=ACTIVE filtern
        // - Radius-Filter anwenden
        // - precision=RADIUS berücksichtigen und Koordinaten maskieren
        // - isSponsored aus Modell übernehmen

        return List.of(
                new MapPostMarkerDto(
                        1L,
                        "EVENT",
                        "Nachbarschaftstreffen",
                        52.52,
                        13.405,
                        true,
                        false,
                        Instant.now()
                ),
                new MapPostMarkerDto(
                        2L,
                        "SKILL",
                        "Biete Fahrradreparatur",
                        52.518,
                        13.407,
                        false,
                        true,
                        Instant.now()
                ),
                new MapPostMarkerDto(
                        3L,
                        "PRODUCT",
                        "Werkzeug zu verschenken",
                        52.521,
                        13.402,
                        false,
                        false,
                        Instant.now()
                ),
                new MapPostMarkerDto(
                        4L,
                        "HOUSING",
                        "Zimmer kurzfristig gesucht",
                        52.519,
                        13.41,
                        true,
                        false,
                        Instant.now()
                )
        );
    }

}

