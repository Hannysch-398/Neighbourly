package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.GeoCoordinatesResponseDto;
import de.neighbourly.backend.service.GeoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/geo")
@RequiredArgsConstructor
public class GeoController {

    private final GeoService geoService;

    @GetMapping("/coordinates")
    public ResponseEntity<GeoCoordinatesResponseDto> getCoordinates(@RequestParam String plz) {
        return ResponseEntity.ok(geoService.getCoordinatesByPlz(plz));
    }
}