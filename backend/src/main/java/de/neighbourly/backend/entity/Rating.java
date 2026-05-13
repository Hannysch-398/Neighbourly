package de.neighbourly.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "rating")
@Setter
@Getter
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private long raterUserId;

    @Column(nullable = false)
    private long ratedUserId;

    //out of 5 rating
    @Column(nullable = false)
    private int rating;

    @Column
    private String comment;

    @Column
    private LocalDateTime creationDate;
}
