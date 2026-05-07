package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.MapDTO;
import de.neighbourly.backend.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<MapDTO> getMapPosts(double lat, double lng, double radius) {
        // Contract: Es werden nur Posts mit status=ACTIVE zurückgegeben.
        // Contract: Bei precision=RADIUS werden lat/lng nur maskiert geliefert.
        // TODO: Sobald echte Post-Entity/Repository verfügbar ist, hier technisch filtern und maskieren.
        return List.of(new MapDTO(1L, "HELP_REQUEST", "Unterstützung gesucht", 52.52, 13.405, true, Instant.now()));
    }
}