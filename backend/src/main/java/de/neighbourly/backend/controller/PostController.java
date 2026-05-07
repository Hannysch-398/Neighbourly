package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.MapDTO;
import de.neighbourly.backend.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<MapDTO>> getPosts(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radius
    ) {
        return ResponseEntity.ok(postService.getMapPosts(lat, lng, radius));
    }
}