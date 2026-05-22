package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class HousingDetailsDto {
    private String housingType;
    private BigDecimal rent;
    private Integer rooms;
    private LocalDate availableFrom;
}
