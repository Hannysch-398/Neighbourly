package de.neighbourly.backend.repository;

import de.neighbourly.backend.dto.MapPostMarkerDto;
import de.neighbourly.backend.entity.PostLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostLocationRepository extends JpaRepository<PostLocation, Long> {

    Optional<PostLocation> findByPostId(Long id);

    @Query("""
        SELECT new de.neighbourly.backend.dto.MapPostMarkerDto(
            p.Id,
            CAST(p.type AS string),
            p.title,
            pl.latitude,
            pl.longitude,
            p.isUrgent,
            CAST(p.postMode AS string)
        )
        FROM PostLocation pl
        JOIN pl.post p
        WHERE p.status = de.neighbourly.backend.model.PostStatus.ACTIVE
          AND (
                :lat IS NULL OR
                :lng IS NULL OR
                :radius IS NULL OR
                (
                    6371 * acos(
                        cos(radians(:lat)) *
                        cos(radians(pl.latitude)) *
                        cos(radians(pl.longitude) - radians(:lng)) +
                        sin(radians(:lat)) *
                        sin(radians(pl.latitude))
                    )
                ) <= :radius
          )
        ORDER BY p.createdAt DESC
    """)
    List<MapPostMarkerDto> findActiveMapMarkersWithinRadius(
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("radius") Double radius
    );
}