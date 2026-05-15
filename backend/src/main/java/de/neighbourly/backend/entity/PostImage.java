package de.neighbourly.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "post_images")
@Getter
@Setter
public class PostImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    private String altText;

    private Integer orderIndex;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}
