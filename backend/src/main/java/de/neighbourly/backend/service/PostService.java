package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.*;
import de.neighbourly.backend.entity.Post;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.mapper.PostMapper;
import de.neighbourly.backend.repository.PostRepository;
import de.neighbourly.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public PostResponseDto createPost(CreatePostRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!request.getIsUrgent() && request.getUrgentUntil() != null) {
            throw new IllegalArgumentException("urgentUntil is only allowed when isUrgent is true");
        }

        Post post = PostMapper.toEntity(request, user);

        LocalDateTime now = LocalDateTime.now();
        post.setCreatedAt(now);
        post.setUpdatedAt(now);

        Post savedPost = postRepository.save(post);

        return PostMapper.toDto(savedPost);

    }

    public PostDetailResponseDto getPostDetail(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Object details = buildDetailsBlock(post);

        return PostMapper.toDetailDto(post, details);
    }

    public List<PostListItemResponseDto> getPostList() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostMapper::toListDto)
                .toList();
    }

    private Object buildDetailsBlock(Post post) {
        return switch (post.getType()) {
            case EVENT -> new EventDetailsDto(
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
