package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.PasswordChangeRequest;
import de.neighbourly.backend.dto.RegistrationRequest;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.repository.UserRepository;
import de.neighbourly.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private UserService userService;
    private UserRepository user;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegistrationRequest request) {
        userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Registrierung erfolgreich");
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verify(@RequestParam String token) {
        userService.verifyUser(token);
        return ResponseEntity.ok("E-Mail erfolgreich verifiziert! Du kannst dich jetzt einloggen.");
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
