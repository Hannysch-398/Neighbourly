package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.RatingResponse;
import de.neighbourly.backend.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostRatingController {

    private final RatingService ratingService;

    public PostRatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @GetMapping("/{postId}/ratings")
    public ResponseEntity<List<RatingResponse>> getPostRatings(@PathVariable Long postId) {
        return ResponseEntity.ok(ratingService.getPostRatings(postId));
    }
}