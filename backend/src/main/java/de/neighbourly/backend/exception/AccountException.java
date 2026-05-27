package de.neighbourly.backend.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public class AccountException extends RuntimeException {

    private final HttpStatus status;
    private final String code;
    private final String field;

    public AccountException(HttpStatus status,
                            String code,
                            String field,
                            String message) {

        super(message);

        this.status = status;
        this.code = code;
        this.field = field;
    }


}
