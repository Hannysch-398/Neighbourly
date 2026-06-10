package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {
    List<PostImage> findAllByPostIdOrderByOrderIndexAsc(Long id);

    long countByPostId(Long postId);

    Optional<PostImage> findTopByPostIdOrderByOrderIndexDesc(Long postId);
}
