package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.Post;
import de.neighbourly.backend.model.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByStatus(PostStatus status);

    List<Post> findByUserIdAndStatus(Long userId, PostStatus status);
}