package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.*;
import de.neighbourly.backend.security.AuthenticatedUserPrincipal;
import de.neighbourly.backend.service.PostService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import static org.assertj.core.api.Assertions.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostControllerTest {

    @Mock
    private PostService postService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private PostController postController;

    @Test
    void createPost_shouldReturnCreatedPost() {
        CreatePostRequest request = new CreatePostRequest();
        PostResponseDto responseDto = mock(PostResponseDto.class);

        when(authentication.getName()).thenReturn("test@example.com");
        when(postService.createPost(request, "test@example.com"))
                .thenReturn(responseDto);

        ResponseEntity<PostResponseDto> response =
                postController.createPost(request, authentication);

        verify(postService).createPost(request, "test@example.com");

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).isEqualTo(responseDto);
    }

    @Test
    void getPosts_shouldReturnPostList() {
        List<PostListItemResponseDto> posts = List.of(
                mock(PostListItemResponseDto.class),
                mock(PostListItemResponseDto.class)
        );

        when(postService.getPostList()).thenReturn(posts);

        ResponseEntity<List<PostListItemResponseDto>> response =
                postController.getPosts();

        verify(postService).getPostList();

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(posts);
    }

    @Test
    void getPostById_shouldReturnPostDetails() {
        Long postId = 1L;
        PostDetailResponseDto dto = mock(PostDetailResponseDto.class);

        when(postService.getPostDetail(postId)).thenReturn(dto);

        ResponseEntity<PostDetailResponseDto> response =
                postController.getPostById(postId);

        verify(postService).getPostDetail(postId);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(dto);
    }

    @Test
    void updatePost_shouldReturnUpdatedPost() {
        Long postId = 1L;

        UpdatePostRequestDto request = new UpdatePostRequestDto();
        PostResponseDto responseDto = mock(PostResponseDto.class);

        AuthenticatedUserPrincipal principal =
                mock(AuthenticatedUserPrincipal.class);

        when(authentication.getPrincipal()).thenReturn(principal);
        when(principal.getUserId()).thenReturn(5L);

        when(postService.updatePost(postId, request, 5L))
                .thenReturn(responseDto);

        ResponseEntity<PostResponseDto> response =
                postController.updatePost(postId, request, authentication);

        verify(postService).updatePost(postId, request, 5L);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(responseDto);
    }

    @Test
    void deletePost_shouldReturnNoContent() {
        Long postId = 1L;

        when(authentication.getName()).thenReturn("test@example.com");

        ResponseEntity<Void> response =
                postController.deletePost(postId, authentication);

        verify(postService)
                .softDeletePost(postId, "test@example.com");

        assertThat(response.getStatusCode().value()).isEqualTo(204);
    }

    @Test
    void getMapPosts_shouldReturnMarkers() {
        List<MapPostDto> markers = List.of(
                mock(MapPostDto.class),
                mock(MapPostDto.class)
        );

        when(postService.getMapPostMarker(
                52.5,
                13.4,
                10.0
        )).thenReturn(markers);

        ResponseEntity<List<MapPostDto>> response =
                postController.getMapPosts(
                        52.5,
                        13.4,
                        10.0
                );

        verify(postService)
                .getMapPostMarker(52.5, 13.4, 10.0);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(markers);
    }

    @Test
    void updatePost_shouldThrowWhenAuthenticationIsNull() {
        UpdatePostRequestDto request = new UpdatePostRequestDto();

        assertThatThrownBy(() ->
                postController.updatePost(1L, request, null))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void updatePost_shouldThrowWhenUserIdIsMissing() {
        UpdatePostRequestDto request = new UpdatePostRequestDto();

        AuthenticatedUserPrincipal principal =
                mock(AuthenticatedUserPrincipal.class);

        when(authentication.getPrincipal()).thenReturn(principal);
        when(principal.getUserId()).thenReturn(null);

        assertThatThrownBy(() ->
                postController.updatePost(1L, request, authentication))
                .isInstanceOf(ResponseStatusException.class);
    }
}