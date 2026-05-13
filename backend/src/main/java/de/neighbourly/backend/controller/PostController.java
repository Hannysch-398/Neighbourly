package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.CreatePostRequest;
import de.neighbourly.backend.dto.PostListItemResponseDto;
import de.neighbourly.backend.dto.MapPostMarkerDto;
import de.neighbourly.backend.dto.PostResponseDto;
import de.neighbourly.backend.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import de.neighbourly.backend.dto.PostDetailResponseDto;

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

    @GetMapping
    public ResponseEntity<List<MapPostMarkerDto>> getMapPosts(@RequestParam double lat, @RequestParam double lng,
                                                              @RequestParam double radius) {
        return ResponseEntity.ok(postService.getMapPostMarker(lat, lng, radius));
    }

}
