package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SkillDetailsDto implements PostDetailsDto {

    private String detailType;

    private List<String> skillTags;
    private String availabilityNote;
    private String experienceLevel;
}
