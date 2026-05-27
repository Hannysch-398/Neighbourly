CREATE TABLE product_details
(
    id           BIGSERIAL PRIMARY KEY,
    post_id      BIGINT         NOT NULL UNIQUE,
    product_name VARCHAR(255)   NOT NULL,
    price        NUMERIC(10, 2) NOT NULL,
    currency     VARCHAR(10)    NOT NULL,
    condition    VARCHAR(100)   NOT NULL,

    CONSTRAINT fk_product_details_post
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE
);