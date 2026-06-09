package de.neighbourly.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import de.neighbourly.backend.model.PrecisionType;

@Entity
@Table(name = "post_locations")
@Getter
@Setter
public class PostLocation {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String city;

        private String district;

        private Double latitude;

        private Double longitude;

        @Enumerated(EnumType.STRING)
        private PrecisionType precision;

        @Column(name = "radius_m")
        private Integer radiusM;

        @OneToOne
        @JoinColumn(name = "post_id", nullable = false)
        private Post post;
}
