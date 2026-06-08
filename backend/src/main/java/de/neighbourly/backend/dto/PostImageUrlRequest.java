package de.neighbourly.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostImageUrlRequest {
    @NotBlank
    private String url;

    private String altText;
}
