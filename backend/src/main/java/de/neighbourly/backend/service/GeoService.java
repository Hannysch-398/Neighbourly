package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.GeoCoordinatesResponseDto;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
public class GeoService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

    private final RestTemplate restTemplate = new RestTemplate();

    public GeoCoordinatesResponseDto getCoordinatesByPlz(String plz) {
        String url = UriComponentsBuilder
                .fromUriString(NOMINATIM_URL)
                .queryParam("postalcode", plz)
                .queryParam("countrycodes", "de")
                .queryParam("format", "json")
                .queryParam("limit", 1)
                .queryParam("addressdetails", 1)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Neighbourly/1.0");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
                }
        );

        List<Map<String, Object>> body = response.getBody();

        if (body == null || body.isEmpty()) {
            throw new IllegalArgumentException("Ungültige Postleitzahl.");
        }

        Map<String, Object> firstResult = body.get(0);
        double latitude = Double.parseDouble(firstResult.get("lat").toString());
        double longitude = Double.parseDouble(firstResult.get("lon").toString());

        @SuppressWarnings("unchecked")
        Map<String, Object> address = (Map<String, Object>) firstResult.get("address");

        String city = address.getOrDefault("city",
                address.getOrDefault("town",
                        address.getOrDefault("village",
                                address.getOrDefault("municipality", "")
                        )
                )
        ).toString();

        if (city.isBlank()) {
            city = firstResult.get("name").toString();
        }

        return new GeoCoordinatesResponseDto(latitude, longitude, city);
    }
}

