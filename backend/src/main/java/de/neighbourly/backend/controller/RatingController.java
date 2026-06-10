package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.AverageRatingResponse;
import de.neighbourly.backend.dto.RatingRequest;
import de.neighbourly.backend.dto.RatingResponse;
import de.neighbourly.backend.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @GetMapping("/users/{userId}/ratings")
    public ResponseEntity<List<RatingResponse>> getAllUserRatings(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                ratingService.getAllUserRatings(userId)
        );
    }

    @GetMapping("/users/{userId}/ratings/{ratingId}")
    public ResponseEntity<RatingResponse> getUserRating(
            @PathVariable Long userId,
            @PathVariable Long ratingId) {

        return ResponseEntity.ok(
                ratingService.getUserRating(userId, ratingId)
        );
    }

    @GetMapping("/users/{userId}/ratings/average")
    public ResponseEntity<AverageRatingResponse> getAverageUserRating(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                ratingService.getAverageRating(userId)
        );
    }

    @PostMapping("/users/{userId}/ratings")
    public ResponseEntity<RatingResponse> postUserRating(
            @PathVariable Long userId,
            @Valid @RequestBody RatingRequest request,
            Authentication authentication) {

        RatingResponse response =
                ratingService.postUserRating(userId, request, authentication.getName());

        return ResponseEntity.ok(response);
    }
}