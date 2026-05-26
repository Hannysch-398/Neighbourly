CREATE TABLE product_details (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    CONSTRAINT fk_product_details_post
                             FOREIGN KEY (post_id)
                             REFERENCES posts(id)
                             ON DELETE CASCADE
);

CREATE TABLE housing_details (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL UNIQUE,
    rent DECIMAL(10, 2) NOT NULL,
    rooms INTEGER NOT NULL,
    available_from DATE NOT NULL,
    CONSTRAINT fk_housing_details_post
                             FOREIGN KEY (post_id)
                             REFERENCES posts(id)
                             ON DELETE CASCADE
);
