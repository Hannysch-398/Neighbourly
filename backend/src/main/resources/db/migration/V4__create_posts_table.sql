CREATE TABLE posts
(
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    description  TEXT         NOT NULL,
    type         VARCHAR(50)  NOT NULL,
    is_urgent    BOOLEAN      NOT NULL,
    urgent_until TIMESTAMP,
    status       VARCHAR(50)  NOT NULL,
    created_at   TIMESTAMP    NOT NULL,
    updated_at   TIMESTAMP    NOT NULL,
    user_id      BIGINT       NOT NULL,

    CONSTRAINT fk_posts_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);