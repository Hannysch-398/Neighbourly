CREATE TABLE housing_details
(
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL UNIQUE,

    housing_type VARCHAR(255),
    rent NUMERIC(10,2) NOT NULL,
    rooms INTEGER NOT NULL,
    available_from DATE NOT NULL,

    CONSTRAINT fk_housing_details_post
        FOREIGN KEY (post_id)
            REFERENCES posts(id)
            ON DELETE CASCADE
);