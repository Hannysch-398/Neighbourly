package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.AverageRatingResponse;
import de.neighbourly.backend.dto.RatingRequest;
import de.neighbourly.backend.dto.RatingResponse;
import de.neighbourly.backend.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("api/users")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    // get All Ratings for one User
    @GetMapping("/{userId}/ratings")
    public ResponseEntity<List<RatingResponse>> getAllUserRatings(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getAllUserRatings(userId));
    }

    @GetMapping("/{userId}/ratings/{ratingId}")
    public ResponseEntity<RatingResponse> getUserRating(@PathVariable Long userId, @PathVariable Long ratingId) {
        return ResponseEntity.ok((ratingService.getUserRating(userId, ratingId)));

    }

    @GetMapping("/{userId}/ratings/average")
    public ResponseEntity<AverageRatingResponse> getAverageUserRating(@PathVariable Long userId){
        return ResponseEntity.ok(ratingService.getAverageRating(userId));
    }


    @PostMapping("/{userId}/ratings")
    public ResponseEntity<RatingResponse> postUserRating(
            @PathVariable Long userId,
            @RequestBody RatingRequest request) {

        RatingResponse response = ratingService.postUserRating(userId, request);
        return ResponseEntity.ok(response);
    }





}