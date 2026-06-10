package de.neighbourly.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "rating",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_rating_post_rater_rated",
                        columnNames = {"post_id", "rater_user_id", "rated_user_id"}
                )
        }
)
@Setter
@Getter
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    @Column(name = "post_id", nullable = false)
    private long postId;

    @Column(name = "rater_user_id", nullable = false)
    private long raterUserId;

    @Column(name = "rated_user_id", nullable = false)
    private long ratedUserId;

    @Column(nullable = false)
    private int rating;

    @Column
    private String comment;

    @Column
    private LocalDateTime creationDate;
}