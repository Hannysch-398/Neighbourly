package de.neighbourly.backend.mapper;

import de.neighbourly.backend.dto.*;
import de.neighbourly.backend.entity.Post;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.model.PostStatus;
import de.neighbourly.backend.dto.PostDetailResponseDto;
import java.util.List;
import de.neighbourly.backend.dto.PostListItemResponseDto;

public class PostMapper {

    private PostMapper() {
    }

    public static Post toEntity(CreatePostRequest request, User user) {
        Post post = new Post();

        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setType(request.getType());
        post.setPostMode(request.getPostMode());
        post.setUrgent(request.getIsUrgent());
        post.setUrgentUntil(request.getUrgentUntil());
        post.setStatus(PostStatus.ACTIVE);
        post.setUser(user);

        return post;
    }

    public static PostResponseDto toDto(Post post) {
        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getType().name(),
                post.getPostMode().name(),
                post.isUrgent(),
                post.getUrgentUntil(),
                post.getCreatedAt(),
                post.getStatus().name(),
                post.getUpdatedAt(),
                null
        );
    }

    public static PostListItemResponseDto toListDto(Post post) {
        return new PostListItemResponseDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getType().name(),
                post.getPostMode().name(),
                post.isUrgent(),
                post.getUrgentUntil(),
                post.getCreatedAt(),
                post.getStatus().name(),
                post.getUpdatedAt()
        );
    }

    public static PostDetailResponseDto toDetailDto(
            Post post,
            LocationDto location,
            List<String> tags,
            List<PostImageDto> images,
            Object details
    ) {
        return new PostDetailResponseDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getType().name(),
                post.getPostMode().name(),
                post.isUrgent(),
                post.getUrgentUntil(),
                post.getCreatedAt(),
                location,
                tags,
                images,
                details,
                null,
                null
        );
    }
}
