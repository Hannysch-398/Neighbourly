package de.neighbourly.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RatingSummaryDto {
    private double average;
    private int ratingCount;
}
