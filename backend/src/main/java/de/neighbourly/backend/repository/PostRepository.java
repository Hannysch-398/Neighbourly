package de.neighbourly.backend.repository;


import de.neighbourly.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}