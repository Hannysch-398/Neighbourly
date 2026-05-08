CREATE TABLE rating (
                        id BIGSERIAL PRIMARY KEY,
                        rater_user_id BIGINT NOT NULL,
                        rated_user_id BIGINT NOT NULL,
                        rating INTEGER NOT NULL,
                        comment VARCHAR(255),
                        creation_date TIMESTAMP
);