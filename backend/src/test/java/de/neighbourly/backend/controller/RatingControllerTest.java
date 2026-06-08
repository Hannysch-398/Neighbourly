package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.AverageRatingResponse;
import de.neighbourly.backend.dto.RatingRequest;
import de.neighbourly.backend.dto.RatingResponse;
import de.neighbourly.backend.service.RatingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingControllerTest {

    @Mock
    private RatingService ratingService;

    @InjectMocks
    private RatingController ratingController;

    @Test
    void getAllUserRatings_shouldReturnRatings() {
        Long userId = 1L;

        List<RatingResponse> ratings = List.of(
                mock(RatingResponse.class),
                mock(RatingResponse.class)
        );

        when(ratingService.getAllUserRatings(userId))
                .thenReturn(ratings);

        ResponseEntity<List<RatingResponse>> response =
                ratingController.getAllUserRatings(userId);

        verify(ratingService).getAllUserRatings(userId);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(ratings);
    }

    @Test
    void getUserRating_shouldReturnRating() {
        Long userId = 1L;
        Long ratingId = 10L;

        RatingResponse rating = mock(RatingResponse.class);

        when(ratingService.getUserRating(userId, ratingId))
                .thenReturn(rating);

        ResponseEntity<RatingResponse> response =
                ratingController.getUserRating(userId, ratingId);

        verify(ratingService).getUserRating(userId, ratingId);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(rating);
    }

    @Test
    void getAverageUserRating_shouldReturnAverageRating() {
        Long userId = 1L;

        AverageRatingResponse average =
                mock(AverageRatingResponse.class);

        when(ratingService.getAverageRating(userId))
                .thenReturn(average);

        ResponseEntity<AverageRatingResponse> response =
                ratingController.getAverageUserRating(userId);

        verify(ratingService).getAverageRating(userId);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(average);
    }

    @Test
    void postUserRating_shouldReturnCreatedRating() {
        Long userId = 1L;

        RatingRequest request = new RatingRequest();
        RatingResponse responseDto = mock(RatingResponse.class);

        when(ratingService.postUserRating(userId, request))
                .thenReturn(responseDto);

        ResponseEntity<RatingResponse> response =
                ratingController.postUserRating(userId, request);

        verify(ratingService).postUserRating(userId, request);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(responseDto);
    }
}