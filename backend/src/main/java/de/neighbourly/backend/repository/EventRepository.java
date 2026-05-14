package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    Optional<Event> findByPostId(Long postId);
}