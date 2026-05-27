package de.neighbourly.backend.repository;

import de.neighbourly.backend.dto.RatingRequest;
import de.neighbourly.backend.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByRatedUserId(Long ratedUserId);

    Rating findByRatedUserIdAndId(Long ratedUserId, Long id);

}