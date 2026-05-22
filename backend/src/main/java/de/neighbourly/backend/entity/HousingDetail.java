package de.neighbourly.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "housing_details")
@Getter
@Setter
public class HousingDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "post_id", nullable = false, unique = true)
    private Post post;

    @Column(name = "housing_type")
    private String housingType;

    @Column(nullable = false)
    private BigDecimal rent;

    @Column(nullable = false)
    private Integer rooms;

    @Column(name = "available_from", nullable = false)
    private LocalDate availableFrom;
}