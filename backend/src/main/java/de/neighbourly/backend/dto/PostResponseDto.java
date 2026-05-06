package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PostResponseDto {

    private Long id;

    private String title;

    private String description;

    private String type;

    private boolean isUrgent;

    private LocalDateTime urgentUntil;

    private LocalDateTime createdAt;
}