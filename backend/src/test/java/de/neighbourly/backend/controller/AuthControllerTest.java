package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.LoginRequest;
import de.neighbourly.backend.dto.RegistrationRequest;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.security.CustomUserDetailsService;
import de.neighbourly.backend.security.JwtService;
import de.neighbourly.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserService userService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private AuthController authController;

    @Test
    void register_shouldReturnCreatedMessage() {
        RegistrationRequest request = new RegistrationRequest();

        ResponseEntity<String> response = authController.register(request);

        verify(userService).registerUser(request);

        assertThat(response.getStatusCode().value()).isEqualTo(201);
        assertThat(response.getBody()).isEqualTo("Registrierung erfolgreich");
    }

    @Test
    void login_shouldAuthenticateAndReturnJwtToken() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setId(1L);

        when(userDetailsService.loadUserByUsername("test@example.com"))
                .thenReturn(userDetails);

        when(userService.getCurrentUserByEmail("test@example.com"))
                .thenReturn(user);

        when(jwtService.generateToken(userDetails, 1L))
                .thenReturn("fake-jwt-token");

        ResponseEntity<String> response = authController.login(request);

        verify(authenticationManager).authenticate(any());
        verify(userDetailsService).loadUserByUsername("test@example.com");
        verify(userService).getCurrentUserByEmail("test@example.com");
        verify(jwtService).generateToken(userDetails, 1L);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("fake-jwt-token");
    }

    @Test
    void verify_shouldVerifyUserAndReturnSuccessMessage() {
        String token = "verification-token";

        ResponseEntity<String> response = authController.verify(token);

        verify(userService).verifyUser(token);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody())
                .isEqualTo("E-Mail wurde erfolgreich verifiziert! Du kannst dich jetzt einloggen.");
    }
}