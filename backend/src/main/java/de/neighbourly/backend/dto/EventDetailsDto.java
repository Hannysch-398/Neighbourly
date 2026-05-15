package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class EventDetailsDto {
    private LocalDateTime eventDate;
    private String locationName;
}
