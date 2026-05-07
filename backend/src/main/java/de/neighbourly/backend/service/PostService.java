package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.MapPostMarkerDto;
import de.neighbourly.backend.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<MapPostMarkerDto> getMapPostMarkers(double lat, double lng, double radius) {
        // Contract:
        // - Es werden nur Posts mit status=ACTIVE zurückgegeben.
        // - Bei precision=RADIUS werden lat/lng nur maskiert geliefert.
        // - isSponsored ist temporär/mockbar, falls Sponsoring noch nicht im Modell existiert.
        //
        // TODO: Sobald echte Post-Entity/Repository verfügbar ist:
        // - nach status=ACTIVE filtern
        // - Radius-Filter anwenden
        // - precision=RADIUS berücksichtigen und Koordinaten maskieren
        // - isSponsored aus Modell übernehmen

        return List.of(
                new MapPostMarkerDto(
                        1L,
                        "EVENT",
                        "Nachbarschaftstreffen",
                        52.52,
                        13.405,
                        true,
                        false,
                        Instant.now()
                ),
                new MapPostMarkerDto(
                        2L,
                        "SKILL",
                        "Biete Fahrradreparatur",
                        52.518,
                        13.407,
                        false,
                        true,
                        Instant.now()
                ),
                new MapPostMarkerDto(
                        3L,
                        "PRODUCT",
                        "Werkzeug zu verschenken",
                        52.521,
                        13.402,
                        false,
                        false,
                        Instant.now()
                ),
                new MapPostMarkerDto(
                        4L,
                        "HOUSING",
                        "Zimmer kurzfristig gesucht",
                        52.519,
                        13.41,
                        true,
                        false,
                        Instant.now()
                )
        );
    }
}