package de.neighbourly.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "skill_details")
@Getter
@Setter
public class SkillDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "post_id", nullable = false, unique = true)
    private Post post;

    @Column(name = "skill_tags", nullable = false)
    private String skillTags;

    @Column(name = "availability_note", nullable = false)
    private String availabilityNote;

    @Column(name = "experience_level", nullable = false)
    private String experienceLevel;
}
