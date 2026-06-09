package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.PasswordChangeRequest;
import de.neighbourly.backend.dto.SuccessResponseDto;
import de.neighbourly.backend.dto.UserProfileDto;
import de.neighbourly.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMe(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.getCurrentUserProfile(email));
    }

    @PutMapping("/me/change-password")
    public ResponseEntity<SuccessResponseDto> changeMyPassword(
            Authentication authentication,
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        String email = authentication.getName();
        userService.changePasswordByEmail(email, request);
        return ResponseEntity.ok(new SuccessResponseDto("Passwort erfolgreich geändert!"));
    }

    @DeleteMapping("/me")
    public ResponseEntity<SuccessResponseDto> deleteMyAccount(Authentication authentication) {
        String email = authentication.getName();
        userService.deleteUserByEmail(email);
        return ResponseEntity.ok(new SuccessResponseDto("Account erfolgreich gelöscht!"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(userService.getUserById(id));
    }

}
