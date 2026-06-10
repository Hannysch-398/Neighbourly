package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.AverageRatingResponse;
import de.neighbourly.backend.dto.RatingRequest;
import de.neighbourly.backend.dto.RatingResponse;
import de.neighbourly.backend.entity.Rating;
import de.neighbourly.backend.repository.RatingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.DoubleSummaryStatistics;
import java.util.List;

import de.neighbourly.backend.entity.Post;
import de.neighbourly.backend.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final PostRepository postRepository;

    public RatingService(RatingRepository ratingRepository, PostRepository postRepository) {
        this.ratingRepository = ratingRepository;
        this.postRepository = postRepository;
    }

    // get all Ratings
    public List<RatingResponse> getAllUserRatings(Long ratedUserId) {
        List<Rating> ratings = ratingRepository.findByRatedUserId(ratedUserId);

        return ratings.stream().map(this::mapToResponse).toList();
    }

    private RatingResponse mapToResponse(Rating rating) {
        return new RatingResponse(rating.getId(), rating.getRaterUserId(), rating.getRatedUserId(), rating.getRating(),
                rating.getComment(), rating.getCreationDate());
    }

    //get specific Rating
    public RatingResponse getUserRating(Long userId, Long ratingId) {
        Rating specificRating = ratingRepository.findByRatedUserIdAndId(userId, ratingId);

        return mapToResponse(specificRating);
    }

    //create Rating for User
    public RatingResponse postUserRating(Long ratedUserIdFromPath, RatingRequest ratingRequest) {
        Post post = postRepository.findById(ratingRequest.getPostId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Post not found"
                ));

        if (post.getUser() == null || post.getUser().getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Post owner not found"
            );
        }

        Long postOwnerId = post.getUser().getId();
        Long raterUserId = ratingRequest.getRaterUserId();

        if (!postOwnerId.equals(ratedUserIdFromPath)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "ratedUserId must be the post owner"
            );
        }

        if (postOwnerId.equals(raterUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Self-rating is not allowed"
            );
        }

        Rating rating = new Rating();
        rating.setRaterUserId(raterUserId);
        rating.setRatedUserId(postOwnerId);
        rating.setRating(ratingRequest.getRating());
        rating.setComment(ratingRequest.getComment());
        rating.setCreationDate(LocalDateTime.now());

        Rating saved = ratingRepository.save(rating);
        return mapToResponse(saved);
    }

    public AverageRatingResponse getAverageRating(Long userId) {
        List<RatingResponse> ratings = getAllUserRatings(userId);

        DoubleSummaryStatistics stats = ratings.stream()
                .mapToDouble(RatingResponse::getRating)
                .summaryStatistics();

        double roundedAverage = Math.round(stats.getAverage() * 10.0) / 10.0;

        return new AverageRatingResponse(
                userId,
                roundedAverage,
                (int) stats.getCount()
        );
    }


}