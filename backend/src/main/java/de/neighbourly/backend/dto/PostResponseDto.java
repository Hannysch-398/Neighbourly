package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDto {

    private Long id;
    private String title;
    private String description;
    private String type;
    private String postMode;
    private boolean isUrgent;
    private LocalDateTime urgentUntil;
    private LocalDateTime createdAt;
    private String status;
    private LocalDateTime updatedAt;
    private LocationDto location;
}