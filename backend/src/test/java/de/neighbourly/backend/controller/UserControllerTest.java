package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.PasswordChangeRequest;
import de.neighbourly.backend.dto.SuccessResponseDto;
import de.neighbourly.backend.dto.UserProfileDto;
import de.neighbourly.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserController userController;

    @Test
    void getMe_shouldReturnCurrentUserProfile() {
        UserProfileDto profile = mock(UserProfileDto.class);

        when(authentication.getName()).thenReturn("test@example.com");
        when(userService.getCurrentUserProfile("test@example.com"))
                .thenReturn(profile);

        ResponseEntity<UserProfileDto> response =
                userController.getMe(authentication);

        verify(userService).getCurrentUserProfile("test@example.com");

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(profile);
    }

    @Test
    void changeMyPassword_shouldReturnSuccessMessage() {
        PasswordChangeRequest request = new PasswordChangeRequest();

        when(authentication.getName()).thenReturn("test@example.com");

        ResponseEntity<SuccessResponseDto> response =
                userController.changeMyPassword(authentication, request);

        verify(userService)
                .changePasswordByEmail("test@example.com", request);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage())
                .isEqualTo("Passwort erfolgreich geändert!");
    }

    @Test
    void deleteMyAccount_shouldReturnSuccessMessage() {
        when(authentication.getName()).thenReturn("test@example.com");

        ResponseEntity<SuccessResponseDto> response =
                userController.deleteMyAccount(authentication);

        verify(userService)
                .deleteUserByEmail("test@example.com");

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage())
                .isEqualTo("Account erfolgreich gelöscht!");
    }
}