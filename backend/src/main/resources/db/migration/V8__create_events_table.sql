CREATE TABLE events
(
    id         BIGSERIAL PRIMARY KEY,
    post_id    BIGINT       NOT NULL UNIQUE,
    start_date TIMESTAMP    NOT NULL,
    end_date   TIMESTAMP    NOT NULL,
    venue      VARCHAR(255) NOT NULL,

    CONSTRAINT fk_events_post
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE
);