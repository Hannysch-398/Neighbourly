package de.neighbourly.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.neighbourly.backend.model.PrecisionType;
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

    @NotNull(message = "lng ist required")
    private Double lng;

    @NotNull(message = "precision is required")
    private PrecisionType precision;

    @JsonProperty("radius_m")
    private Integer radiusM;

    public void validate() {
        if (precision == PrecisionType.RADIUS && radiusM == null) {
            throw new IllegalArgumentException("radius_m is required when precision is RADIUS");
        }
    }
}
