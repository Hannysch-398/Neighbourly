package de.neighbourly.backend.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.EXISTING_PROPERTY,
        property = "detailType",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = EventDetailsDto.class, name = "EVENT"),
        @JsonSubTypes.Type(value = SkillDetailsDto.class, name = "SKILL"),
        @JsonSubTypes.Type(value = ProductDetailsDto.class, name = "PRODUCT"),
        @JsonSubTypes.Type(value = HousingDetailsDto.class, name = "HOUSING")
})
public interface PostDetailsDto {
    String getDetailType();
}