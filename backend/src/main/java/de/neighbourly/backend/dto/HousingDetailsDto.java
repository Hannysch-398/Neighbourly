package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HousingDetailsDto implements PostDetailsDto {

    private String detailType;

    private String housingType;
    private BigDecimal rent;
    private Integer rooms;
    private LocalDate availableFrom;
}
