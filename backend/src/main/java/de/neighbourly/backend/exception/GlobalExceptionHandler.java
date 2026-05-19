package de.neighbourly.backend.exception;

import de.neighbourly.backend.dto.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ErrorResponseDto response = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                errors
        );

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDto> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> errors = new HashMap<>();

        String message = ex.getMessage() != null ? ex.getMessage() : "Invalid request";
        String field = "request";

        if (message.contains("urgentUntil")) {
            field = "urgentUntil";
        } else if (message.contains("venue")) {
            field = "venue";
        } else if (message.contains("startDate")) {
            field = "startDate";
        } else if (message.contains("endDate")) {
            field = "endDate";
        } else if (message.contains("Event details")) {
            field = "details";
        } else if (message.contains("productName")) {
            field = "productName";
        } else if (message.contains("price")) {
            field = "price";
        } else if (message.contains("currency")) {
            field = "currency";
        } else if (message.contains("condition")) {
            field = "condition";
        } else if (message.contains("Product details")) {
            field = "details";
        }

        errors.put(field, message);

        ErrorResponseDto response = new ErrorResponseDto(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                errors
        );

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponseDto> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> errors = new HashMap<>();
        String message = ex.getReason() != null ? ex.getReason() : "Request failed";

        errors.put("request", message);

        ErrorResponseDto response = new ErrorResponseDto(
                ex.getStatusCode().value(),
                message,
                errors
        );

        return new ResponseEntity<>(response, ex.getStatusCode());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGenericException(Exception ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("server", "Unexpected server error");

        ErrorResponseDto response = new ErrorResponseDto(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal server error",
                errors
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}