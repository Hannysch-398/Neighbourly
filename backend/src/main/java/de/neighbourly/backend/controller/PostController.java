package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.CreatePostRequest;
import de.neighbourly.backend.dto.PostListItemResponseDto;
import de.neighbourly.backend.dto.MapPostDto;
import de.neighbourly.backend.dto.PostImageDto;
import de.neighbourly.backend.dto.PostImageUrlRequest;
import de.neighbourly.backend.dto.PostResponseDto;
import de.neighbourly.backend.dto.SuccessResponseDto;
import de.neighbourly.backend.dto.UpdatePostRequestDto;
import de.neighbourly.backend.security.AuthenticatedUserPrincipal;
import de.neighbourly.backend.entity.Post;
import de.neighbourly.backend.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import de.neighbourly.backend.dto.PostDetailResponseDto;
import de.neighbourly.backend.dto.UpdatePostRequest;

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@Valid @RequestBody CreatePostRequest request,
                                                      Authentication authentication) {
        String email = authentication.getName();

        PostResponseDto response = postService.createPost(request, email);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PostListItemResponseDto>> getPosts() {
        return ResponseEntity.ok(postService.getPostList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponseDto> getPostById(@PathVariable Long id) {
        PostDetailResponseDto response = postService.getPostDetail(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDto> updatePost(@PathVariable Long id,
                                                      @Valid @RequestBody UpdatePostRequestDto request,
                                                      Authentication authentication) {
        PostResponseDto response = postService.updatePost(id, request, getAuthenticatedUserId(authentication));
        return ResponseEntity.ok(response);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        postService.softDeletePost(id, email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostImageDto> uploadPostImage(@PathVariable Long id,
                                                        @RequestPart("file") MultipartFile file,
                                                        @RequestParam(required = false) String altText,
                                                        Authentication authentication) {
        PostImageDto response = postService.uploadPostImage(id, file, altText, getAuthenticatedUserId(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostImageDto> addPostImageUrl(@PathVariable Long id,
                                                        @Valid @RequestBody PostImageUrlRequest request,
                                                        Authentication authentication) {
        PostImageDto response = postService.addPostImageUrl(id, request, getAuthenticatedUserId(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/marker")
    public ResponseEntity<List<MapPostDto>> getMapPosts(@RequestParam double lat, @RequestParam double lng,
                                                        @RequestParam double radius) {
        return ResponseEntity.ok(postService.getMapPostMarker(lat, lng, radius));
    }




    private Long getAuthenticatedUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUserPrincipal principal)) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        if (principal.getUserId() == null) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "JWT user_id is missing");
        }

        return principal.getUserId();
    }
}
