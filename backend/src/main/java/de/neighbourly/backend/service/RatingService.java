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

@Service
public class RatingService {

    private final RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
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
    public RatingResponse postUserRating(Long userId, RatingRequest ratingRequest) {
        Rating rating = new Rating();
        rating.setRaterUserId(ratingRequest.getRaterUserId());
        rating.setRatedUserId(userId);
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

        return new AverageRatingResponse(
                userId,                    // id
                stats.getAverage(),       // average
                (int) stats.getCount()    // ratingAmount
        );
    }


}