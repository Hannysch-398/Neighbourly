package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SkillDetailsDto {
    private List<String> skillTags;
    private String availabilityNote;
    private String experienceLevel;
}
