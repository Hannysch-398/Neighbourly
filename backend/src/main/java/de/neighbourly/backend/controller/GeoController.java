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
    public ResponseEntity<GeoCoordinatesResponseDto> getCoordinates(
            @RequestParam String plz,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String address
    ) {
        if (address != null && !address.isBlank()) {
            return ResponseEntity.ok(
                    geoService.getCoordinatesByAddress(address, plz, city)
            );
        }

        return ResponseEntity.ok(geoService.getCoordinatesByPlz(plz));
    }
}