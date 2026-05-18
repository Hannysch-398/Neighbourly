package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SkillDetailsDto implements PostDetailsDto {

    private String detailType;

    private String skillName;
    private String experienceLevel;
}
