package de.neighbourly.backend.controller;
import de.neighbourly.backend.dto.PasswordChangeRequest;
import de.neighbourly.backend.dto.RegistrationRequest;
import de.neighbourly.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegistrationRequest request) {
        userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Registrierung erfolgreich");
    }
    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        userService.changePassword(id, request);
        return ResponseEntity.ok("Passwort erfolgreich geändert!");
    }
}