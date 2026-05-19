package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.PostLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLocationRepository extends JpaRepository<PostLocation, Long> {

    Optional<PostLocation> findByPostId(Long Id);
}
