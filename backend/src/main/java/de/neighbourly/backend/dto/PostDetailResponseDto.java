package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;


@AllArgsConstructor
@Getter
@Setter
public class PostDetailResponseDto {

    private Long id;

    private String title;

    private String description;

    private String type;

    private boolean isUrgent;

    private LocalDateTime urgentUntil;

    private LocalDateTime createdAt;

    private LocationDto location;

    private List<String> tags;

    private List<PostImageDto> images;

    private Object details;

    private AverageRatingResponse averageRating;

    private ReportSummaryDto reportSummary;

}
