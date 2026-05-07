package de.neighbourly.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


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

    private RatingSummaryDto ratingSummary;

    private ReportSummaryDto reportSummary;

}
