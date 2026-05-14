CREATE TABLE post_locations
(
    id        BIGSERIAL PRIMARY KEY,
    post_id   BIGINT NOT NULL,
    city      VARCHAR(255),
    district  VARCHAR(255),
    latitude  DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    CONSTRAINT fk_post_locations_post
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE
);

CREATE TABLE post_tags
(
    id      BIGSERIAL PRIMARY KEY,
    post_id BIGINT       NOT NULL,
    name    VARCHAR(100) NOT NULL,

    CONSTRAINT fk_post_tags_post
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE
);

CREATE TABLE post_images
(
    id          BIGSERIAL PRIMARY KEY,
    post_id     BIGINT  NOT NULL,
    url         TEXT    NOT NULL,
    alt_text    VARCHAR(255),
    order_index INTEGER NOT NULL,

    CONSTRAINT fk_post_images_post
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE
);