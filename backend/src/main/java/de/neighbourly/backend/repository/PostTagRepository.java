package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.PostTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface PostTagRepository extends JpaRepository<PostTag, Long> {
    List<PostTag> findAllByPostId(Long id);
}
