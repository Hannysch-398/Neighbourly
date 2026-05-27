CREATE TABLE skill_details
(
    id                BIGSERIAL PRIMARY KEY,
    post_id           BIGINT       NOT NULL UNIQUE,
    skill_tags        TEXT         NOT NULL,
    availability_note TEXT         NOT NULL,
    experience_level  VARCHAR(100) NOT NULL,

    CONSTRAINT fk_skill_details_post
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE
);