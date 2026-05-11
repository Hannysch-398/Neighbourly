CREATE TABLE email_verification_tokens
(
    id          BIGSERIAL PRIMARY KEY,

    token       VARCHAR(255),

    user_id     BIGINT NOT NULL UNIQUE,

    expiry_date TIMESTAMP,

    CONSTRAINT fk_email_verification_tokens_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);