package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    //private String role;
    //private String rate;
}