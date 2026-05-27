package de.neighbourly.backend.repository;

import de.neighbourly.backend.dto.MapPostMarkerDto;
import de.neighbourly.backend.entity.Post;
import de.neighbourly.backend.model.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByStatus(PostStatus status);
}