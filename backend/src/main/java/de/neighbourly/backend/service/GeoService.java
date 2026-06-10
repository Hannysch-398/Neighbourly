package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.GeoCoordinatesResponseDto;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Map;

@Service
public class GeoService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

    private final RestTemplate restTemplate = new RestTemplate();

    public GeoCoordinatesResponseDto getCoordinates(String plz, String city, String address) {
        if (address != null && !address.isBlank()) {
            return getCoordinatesByFullAddress(plz, city, address);
        }

        return getCoordinatesByPlz(plz);
    }

    private GeoCoordinatesResponseDto getCoordinatesByFullAddress(String plz, String city, String address) {

        String originalStreet = address.trim();

        String normalizedStreet = originalStreet
                .replace("ß", "ss")
                .replace("Straße", "Strasse")
                .replace("straße", "strasse");

        List<String> streets = List.of(originalStreet, normalizedStreet);

        for (String street : streets) {
            String url = UriComponentsBuilder
                    .fromUriString(NOMINATIM_URL)
                    .queryParam("street", street)
                    .queryParam("postalcode", plz.trim())
                    .queryParam("city", city.trim())
                    .queryParam("country", "Germany")
                    .queryParam("countrycodes", "de")
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .queryParam("addressdetails", 1)
                    .toUriString();

            List<Map<String, Object>> body = fetchGeoResults(url);

            if (body != null && !body.isEmpty()) {
                Map<String, Object> firstResult = body.get(0);

                double latitude = Double.parseDouble(firstResult.get("lat").toString());
                double longitude = Double.parseDouble(firstResult.get("lon").toString());

                return new GeoCoordinatesResponseDto(latitude, longitude, city.trim());
            }
        }

        List<String> queries = List.of(
                originalStreet + ", " + plz.trim() + " " + city.trim() + ", Deutschland",
                normalizedStreet + ", " + plz.trim() + " " + city.trim() + ", Deutschland",
                city.trim() + " " + originalStreet,
                city.trim() + " " + normalizedStreet
        );

        for (String query : queries) {
            String url = UriComponentsBuilder
                    .fromUriString(NOMINATIM_URL)
                    .queryParam("q", query)
                    .queryParam("countrycodes", "de")
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .queryParam("addressdetails", 1)
                    .toUriString();

            List<Map<String, Object>> body = fetchGeoResults(url);

            if (body != null && !body.isEmpty()) {
                Map<String, Object> firstResult = body.get(0);

                double latitude = Double.parseDouble(firstResult.get("lat").toString());
                double longitude = Double.parseDouble(firstResult.get("lon").toString());

                return new GeoCoordinatesResponseDto(latitude, longitude, city.trim());
            }
        }

        throw new IllegalArgumentException("Die eingegebene Adresse konnte nicht gefunden werden.");
    }
    public GeoCoordinatesResponseDto getCoordinatesByPlz(String plz) {
        String url = UriComponentsBuilder
                .fromUriString(NOMINATIM_URL)
                .queryParam("postalcode", plz)
                .queryParam("countrycodes", "de")
                .queryParam("format", "json")
                .queryParam("limit", 1)
                .queryParam("addressdetails", 1)
                .toUriString();

        List<Map<String, Object>> body = fetchGeoResults(url);

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


    private List<Map<String, Object>> fetchGeoResults(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Neighbourly/1.0");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<>() {
                    }
            );

            return response.getBody();
        } catch (HttpClientErrorException.TooManyRequests ex) {
            throw new IllegalArgumentException(
                    "Der Geocoding-Dienst ist aktuell ausgelastet. Bitte versuche es gleich erneut."
            );
        }
    }



}

