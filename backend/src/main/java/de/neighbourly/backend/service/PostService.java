package de.neighbourly.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.neighbourly.backend.dto.*;
import de.neighbourly.backend.entity.*;
import de.neighbourly.backend.mapper.PostMapper;
import de.neighbourly.backend.model.PostStatus;
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
    private final ProductDetailRepository productDetailRepository;
    private final PostLocationRepository postLocationRepository;
    private final PostTagRepository postTagRepository;
    private final PostImageRepository postImageRepository;
    private final ObjectMapper objectMapper;
    private final HousingDetailRepository housingDetailRepository;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            EventRepository eventRepository,
            SkillDetailRepository skillDetailRepository,
            ProductDetailRepository productDetailRepository,
            PostLocationRepository postLocationRepository,
            PostTagRepository postTagRepository,
            PostImageRepository postImageRepository,
            ObjectMapper objectMapper,
            HousingDetailRepository housingDetailRepository


    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.skillDetailRepository = skillDetailRepository;
        this.productDetailRepository = productDetailRepository;
        this.postLocationRepository = postLocationRepository;
        this.postTagRepository = postTagRepository;
        this.postImageRepository = postImageRepository;
        this.housingDetailRepository = housingDetailRepository;
        this.objectMapper = objectMapper;


    }

    public PostResponseDto createPost(CreatePostRequest request, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        validateTypeSpecificDetails(request);

        if (!request.getIsUrgent() && request.getUrgentUntil() != null) {
            throw new IllegalArgumentException("urgentUntil is only allowed when isUrgent is true");
        }

        Post post = PostMapper.toEntity(request, user);

        LocalDateTime now = LocalDateTime.now();
        post.setCreatedAt(now);
        post.setUpdatedAt(now);

        Post savedPost = postRepository.save(post);

        saveLocation(request, savedPost);
        saveTypeSpecificDetails(request, savedPost);

        return PostMapper.toDto(savedPost);
    }

    public PostDetailResponseDto getPostDetail(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        Object details = buildDetailsBlock(post);

        LocationDto location = postLocationRepository.findByPostId(postId).map(this::mapLocation).orElse(null);

        List<String> tags = postTagRepository.findAllByPostId(postId).stream().map(PostTag::getName).toList();

        List<PostImageDto> images =
                postImageRepository.findAllByPostIdOrderByOrderIndexAsc(postId).stream().map(this::mapImage).toList();

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
        if (request.getType() == PostType.PRODUCT) {
            ProductDetailsDto details = getProductDetails(request);

            if (details == null) {
                throw new IllegalArgumentException("Product details are required");
            }

            if (details.getProductName() == null || details.getProductName().isBlank()) {
                throw new IllegalArgumentException("productName is required");
            }

            if (details.getPrice() == null) {
                throw new IllegalArgumentException("price is required");
            }

            if (details.getCurrency() == null || details.getCurrency().isBlank()) {
                throw new IllegalArgumentException("currency is required");
            }

            if (details.getCondition() == null || details.getCondition().isBlank()) {
                throw new IllegalArgumentException("condition is required");
            }
        }
        if (request.getType() == PostType.HOUSING) {
            HousingDetailsDto details = getHousingDetails(request);

            if (details == null) {
                throw new IllegalArgumentException("Housing details are required");
            }

            if (details.getRent() == null) {
                throw new IllegalArgumentException("rent is required");
            }

            if (details.getRooms() == null) {
                throw new IllegalArgumentException("rooms are required");
            }

            if (details.getAvailableFrom() == null) {
                throw new IllegalArgumentException("availableFrom is required");
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
        if (request.getType() == PostType.PRODUCT) {
            ProductDetailsDto details = getProductDetails(request);

            ProductDetail productDetail = new ProductDetail();
            productDetail.setPost(savedPost);
            productDetail.setProductName(details.getProductName());
            productDetail.setPrice(details.getPrice());
            productDetail.setCurrency(details.getCurrency());
            productDetail.setCondition(details.getCondition());

            productDetailRepository.save(productDetail);
        }
        if (request.getType() == PostType.HOUSING) {
            HousingDetailsDto details = getHousingDetails(request);

            HousingDetail housingDetail = new HousingDetail();
            housingDetail.setPost(savedPost);
            housingDetail.setHousingType(details.getHousingType());
            housingDetail.setRent(details.getRent());
            housingDetail.setRooms(details.getRooms());
            housingDetail.setAvailableFrom(details.getAvailableFrom());

            housingDetailRepository.save(housingDetail);
        }
    }

    private Object buildDetailsBlock(Post post) {
        return switch (post.getType()) {
            case EVENT -> new EventDetailsDto(null, null, null);
            case SKILL -> new SkillDetailsDto(null, null, null);
            case PRODUCT -> new ProductDetailsDto(null, null, null, null);
            case HOUSING -> new HousingDetailsDto(null, null, null, null);
        };
    }

    private LocationDto mapLocation(PostLocation location) {
        return new LocationDto(location.getCity(), location.getDistrict(), location.getLatitude(),
                location.getLongitude());
    }

    private PostImageDto mapImage(PostImage image) {
        return new PostImageDto(image.getId(), image.getUrl(), image.getAltText());
    }

    private static final double MAX_RADIUS = 20_000;


    private EventDetailsDto getEventDetails(CreatePostRequest request) {
        return objectMapper.convertValue(request.getDetails(), EventDetailsDto.class);
    }

    private SkillDetailsDto getSkillDetails(CreatePostRequest request) {
        return objectMapper.convertValue(request.getDetails(), SkillDetailsDto.class);
    }


    private ProductDetailsDto getProductDetails(CreatePostRequest request) {
        return objectMapper.convertValue(request.getDetails(), ProductDetailsDto.class);
    }


    private HousingDetailsDto getHousingDetails(CreatePostRequest request) {
        return objectMapper.convertValue(request.getDetails(), HousingDetailsDto.class);
    }


    private void validateGeoParameters(Double lat, Double lng, Double radius) {

        if (lat == null) {
            throw new IllegalArgumentException("lat is required");
        }

        if (lng == null) {
            throw new IllegalArgumentException("lng is required");
        }

        if (radius == null) {
            throw new IllegalArgumentException("radius is required");
        }

        if (lat < -90 || lat > 90) {
            throw new IllegalArgumentException("lat must be between -90 and 90");
        }

        if (lng < -180 || lng > 180) {
            throw new IllegalArgumentException("lng must be between -180 and 180");
        }

        if (radius <= 0) {
            throw new IllegalArgumentException("radius must be greater than 0");
        }

        if (radius > MAX_RADIUS) {
            throw new IllegalArgumentException(
                    "radius must be less than or equal to " + MAX_RADIUS
            );
        }
    }


    public List<PostListItemResponseDto> getPostList() {
        return postRepository.findByStatus(PostStatus.ACTIVE).stream().map(PostMapper::toListDto).toList();
    }

    public List<MapPostMarkerDto> getMapPostMarker(Double lat, Double lng, Double radius) {
        validateGeoParameters(lat,lng,radius);
        return postLocationRepository.findActiveMapMarkersWithinRadius(lat, lng, radius);
    }

    private void saveLocation(CreatePostRequest request, Post savedPost) {
        if (request.getLocation() == null) {
            return;
        }

        LocationDto dto = request.getLocation();

        PostLocation location = new PostLocation();
        location.setPost(savedPost);
        location.setCity(dto.getCity());
        location.setDistrict(dto.getDistrict());
        location.setLatitude(dto.getLatitude());
        location.setLongitude(dto.getLongitude());

        postLocationRepository.save(location);
    }


}

