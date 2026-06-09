package de.neighbourly.backend.controller;

import de.neighbourly.backend.dto.GeoCoordinatesResponseDto;
import de.neighbourly.backend.service.GeoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GeoControllerTest {

    @Mock
    private GeoService geoService;

    @InjectMocks
    private GeoController geoController;

    @Test
    void getCoordinates_shouldReturnCoordinates() {
        String plz = "10115";

        GeoCoordinatesResponseDto expectedResponse =
                mock(GeoCoordinatesResponseDto.class);

        when(geoService.getCoordinatesByPlz(plz))
                .thenReturn(expectedResponse);

        ResponseEntity<GeoCoordinatesResponseDto> response =
                geoController.getCoordinates(plz);

        verify(geoService).getCoordinatesByPlz(plz);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(expectedResponse);
    }
}