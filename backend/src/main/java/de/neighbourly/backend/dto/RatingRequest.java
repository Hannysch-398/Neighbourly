package de.neighbourly.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class RatingRequest {
    private long raterUserId;
    private long ratedUserId;
    private int rating;
    private String comment;
    private LocalDateTime creationDate;
}
