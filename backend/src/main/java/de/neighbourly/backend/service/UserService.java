package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.PasswordChangeRequest;
import de.neighbourly.backend.dto.RegistrationRequest;
import de.neighbourly.backend.dto.UserProfileDto;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.entity.VerificationToken;
import de.neighbourly.backend.mapper.UserMapper;
import de.neighbourly.backend.repository.UserRepository;
import de.neighbourly.backend.repository.VerificationTokenRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       VerificationTokenRepository tokenRepository,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    public void registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "E-Mail ist bereits registriert"
            );
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Username ist bereits vergeben"
            );
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setEmailVerified(false);

        User savedUser = userRepository.save(newUser);

        String tokenValue = java.util.UUID.randomUUID().toString();
        VerificationToken token = new VerificationToken(tokenValue, savedUser);
        tokenRepository.save(token);


        String verifyLink = ("http://localhost:4200/verify-email?token=" + tokenValue);
        emailService.sendSimpleEmail(request.getEmail(),"Neighbourly - E-mail Bestätigung","Um Ihre E-Mail-Adresse zu bestätigen, klicken Sie bitte auf den folgenden Link. " + verifyLink);

    }

    public void verifyUser(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ungültiger Token"));

        if (verificationToken.isExpired()) {
            tokenRepository.delete(verificationToken);
            throw new ResponseStatusException(HttpStatus.GONE, "Verifizierungs-Link abgelaufen. Bitte neu " +
                    "registrieren.");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        tokenRepository.delete(verificationToken);
    }


    public void changePasswordByEmail(String email, PasswordChangeRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User nicht gefunden"));

        if (Objects.equals(request.getOldPassword(), request.getNewPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Das neue Passwort darf nicht dem alten Passwort entsprechen"
            );
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Das alte Passwort ist falsch"
            );
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void deleteUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User nicht gefunden"));

        userRepository.delete(user);
    }

    public User getCurrentUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User nicht gefunden"));
    }

    public UserProfileDto getCurrentUserProfile(String email) {
        User user = getCurrentUserByEmail(email);
        return UserMapper.toDto(user);
    }
}