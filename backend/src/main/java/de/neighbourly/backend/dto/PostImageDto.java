package de.neighbourly.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PostImageDto {
    private Long id;
    private String url;
    private String altText;
    private Integer orderIndex;
    private LocalDateTime createdAt;
}
