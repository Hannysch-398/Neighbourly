package de.neighbourly.backend.mapper;

import de.neighbourly.backend.dto.UserProfileDto;
import de.neighbourly.backend.entity.User;

public class UserMapper {
    public static UserProfileDto toDto(User user){
        return new UserProfileDto (
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
