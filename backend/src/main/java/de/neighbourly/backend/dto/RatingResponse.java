package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@AllArgsConstructor
public class RatingResponse {
    private long Id;
    private long raterUserId;
    private long ratedUserId;
    private int rating;
    private String comment;
    private LocalDateTime creationDate;
}