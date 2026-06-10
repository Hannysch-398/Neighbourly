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
        String url = buildUrlWithParams(Map.of(
                "postalcode", plz.trim(),
                "countrycodes", "de",
                "format", "jsonv2",
                "limit", "1",
                "addressdetails", "1"
        ));

        return fetchCoordinates(url, "Ungültige Postleitzahl.");
    }

    public GeoCoordinatesResponseDto getCoordinatesByAddress(String address, String plz, String city) {
        String normalizedCity = normalizeCity(city);
        String normalizedAddress = address.trim();
        String normalizedPlz = plz.trim();

        try {
            return fetchCoordinates(
                    buildQueryUrl(normalizedAddress + ", " + normalizedPlz + " " + normalizedCity + ", Deutschland", 1),
                    "Ungültige Adresse."
            );
        } catch (IllegalArgumentException ignored) {
        }

        try {
            return fetchCoordinates(
                    buildQueryUrl(normalizedAddress + ", " + normalizedCity + ", Deutschland", 1),
                    "Ungültige Adresse."
            );
        } catch (IllegalArgumentException ignored) {
        }

        String streetOnly = removeHouseNumber(normalizedAddress);

        if (!streetOnly.equals(normalizedAddress)) {
            return fetchCoordinates(
                    buildQueryUrl(streetOnly + ", " + normalizedPlz + " " + normalizedCity + ", Deutschland", 1),
                    "Ungültige Adresse."
            );
        }

        throw new IllegalArgumentException("Ungültige Adresse.");
    }

    private String buildQueryUrl(String query, int limit) {
        String url = UriComponentsBuilder
                .fromUriString(NOMINATIM_URL)
                .queryParam("q", query)
                .queryParam("countrycodes", "de")
                .queryParam("format", "jsonv2")
                .queryParam("limit", limit)
                .queryParam("addressdetails", 1)
                .build()
                .encode()
                .toUriString();

        System.out.println("NOMINATIM QUERY URL: " + url);

        return url;
    }

    private String buildUrlWithParams(Map<String, String> params) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(NOMINATIM_URL);
        params.forEach(builder::queryParam);

        String url = builder.build().encode().toUriString();

        System.out.println("NOMINATIM URL: " + url);

        return url;
    }

    private GeoCoordinatesResponseDto fetchCoordinates(String url, String errorMessage) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Neighbourly/1.0 (local development)");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> body = response.getBody();

        System.out.println("NOMINATIM RESULT COUNT: " + (body == null ? 0 : body.size()));

        if (body == null || body.isEmpty()) {
            throw new IllegalArgumentException(errorMessage);
        }

        body.forEach(result ->
                System.out.println("DISPLAY NAME: " + result.get("display_name"))
        );

        Map<String, Object> firstResult = body.get(0);

        double latitude = Double.parseDouble(firstResult.get("lat").toString());
        double longitude = Double.parseDouble(firstResult.get("lon").toString());

        @SuppressWarnings("unchecked")
        Map<String, Object> address = (Map<String, Object>) firstResult.get("address");

        String city = "";

        if (address != null) {
            city = address.getOrDefault("city",
                    address.getOrDefault("town",
                            address.getOrDefault("village",
                                    address.getOrDefault("municipality",
                                            address.getOrDefault("city_district", "")
                                    )
                            )
                    )
            ).toString();
        }

        if (city.isBlank() && firstResult.get("name") != null) {
            city = firstResult.get("name").toString();
        }

        return new GeoCoordinatesResponseDto(latitude, longitude, city);
    }

    private String removeHouseNumber(String address) {
        return address.replaceAll("\\s+\\d+[a-zA-Z]?$", "").trim();
    }

    private String normalizeCity(String city) {
        return city == null ? "" : city.trim();
    }
}