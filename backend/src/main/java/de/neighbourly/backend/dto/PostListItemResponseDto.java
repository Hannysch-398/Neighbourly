package de.neighbourly.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PostListItemResponseDto {

    private Long id;
    private String title;
    private String description;
    private String type;
    private String postMode;

    @JsonProperty("isUrgent")
    private boolean urgent;
    private LocalDateTime urgentUntil;
    private LocalDateTime createdAt;
    private String status;
    private LocalDateTime updatedAt;
    private LocationDto location;
}
