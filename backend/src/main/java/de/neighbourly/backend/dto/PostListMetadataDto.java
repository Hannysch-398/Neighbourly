package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PostListMetadataDto {

    private String status;
    private LocalDateTime updatedAt;
    private String locationLabel;
}
