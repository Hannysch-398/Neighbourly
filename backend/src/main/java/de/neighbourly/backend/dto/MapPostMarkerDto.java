package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class MapPostMarkerDto {
    private Long id;
    private String type;
    private String title;
    private double lat;
    private double lng;
    private boolean isUrgent;
    private boolean isSponsored;
    private Instant createdAt;
}