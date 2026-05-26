package de.neighbourly.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostLocationDto {

    @NotNull(message = "lat is required")
    private Double lat;

    @NotNull(message = "lng is required")
    private Double lng;

    @NotNull(message = "precision is required")
    private String precision;

    @NotNull(message = "radius_m is required")
    @JsonProperty("radius_m")
    private Integer radiusM;
}
