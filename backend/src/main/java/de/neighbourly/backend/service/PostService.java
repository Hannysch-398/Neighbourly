package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.CreatePostRequest;
import de.neighbourly.backend.dto.PostResponseDto;
import de.neighbourly.backend.entity.Post;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.mapper.PostMapper;
import de.neighbourly.backend.repository.PostRepository;
import de.neighbourly.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import de.neighbourly.backend.dto.PostDetailResponseDto;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

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

    public PostDetailResponseDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        return PostMapper.toDetailDto(post);
    }
}