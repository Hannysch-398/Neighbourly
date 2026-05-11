package de.neighbourly.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PostImageDto {
    private Long id;
    private String url;
    private String altText;
}
