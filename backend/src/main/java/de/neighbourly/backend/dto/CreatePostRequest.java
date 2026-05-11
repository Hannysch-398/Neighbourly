package de.neighbourly.backend.dto;


import de.neighbourly.backend.model.PostType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CreatePostRequest {

    private String title;
    private String description;
    private PostType type;
    private boolean isUrgent;
    private LocalDateTime urgentUntil;
}
