package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AverageRatingResponse {
    private long id;
    private double average;
    private int ratingAmount;
}
