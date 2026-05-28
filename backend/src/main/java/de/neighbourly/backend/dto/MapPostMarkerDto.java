package de.neighbourly.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("isUrgent")

    private boolean urgent;
    private String postMode;
//    private boolean isSponsored;
//    private Instant createdAt;
}