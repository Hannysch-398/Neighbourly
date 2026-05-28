package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {
List<PostImage> findAllByPostIdOrderByOrderIndexAsc(Long id);
}
