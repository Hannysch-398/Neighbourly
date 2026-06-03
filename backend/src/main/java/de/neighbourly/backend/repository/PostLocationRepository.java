package de.neighbourly.backend.repository;

import de.neighbourly.backend.dto.MapPostDto;
import de.neighbourly.backend.entity.PostLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;


public interface PostLocationRepository extends JpaRepository<PostLocation, Long> {

    Optional<PostLocation> findByPostId(Long postId);

    @Query("""
    SELECT pl
    FROM PostLocation pl
    JOIN pl.post p
    WHERE p.status = de.neighbourly.backend.model.PostStatus.ACTIVE
      AND (
          6371000 * acos(
              cos(radians(:lat)) *
              cos(radians(pl.latitude)) *
              cos(radians(pl.longitude) - radians(:lng)) +
              sin(radians(:lat)) *
              sin(radians(pl.latitude))
          )
      ) <= :radius
    ORDER BY p.createdAt DESC
""")
    List<PostLocation> findActiveMapMarkersWithinRadius(
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("radius") Double radius
    );
}