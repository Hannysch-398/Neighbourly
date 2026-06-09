package de.neighbourly.backend.dto;

import de.neighbourly.backend.model.PrecisionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LocationDto {
    private String city;
    private String postalCode;
    private String address;
    private Double latitude;
    private Double longitude;
    private PrecisionType precision;
    private Integer radiusM;
}
