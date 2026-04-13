package de.neighbourly.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordChangeRequest {
    @NotBlank(message = "Das alte Passwort darf nicht leer sein")
    private String oldPassword;

    @NotBlank(message = "Das neue Passwort darf nicht leer sein")
    @Size(min = 8, max = 30, message = "Passwort muss zwischen 8 und 30 Zeichen lang sein")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_])(?=\\S+$).{8,}$",
            message = "Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten"
    )
    private String newPassword;
}