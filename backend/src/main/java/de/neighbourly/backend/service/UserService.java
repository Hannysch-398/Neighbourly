package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.RegistrationRequest;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Konstruktor-basiertes Autowiring (Best Practice)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email bereits vergeben");
        }

        User newUser = new User();
        newUser.setEmail(request.getEmail());

        // Jetzt ist passwordEncoder NICHT mehr null
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setEmailVerified(false);

        userRepository.save(newUser);
    }
}