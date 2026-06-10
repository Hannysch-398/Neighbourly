ALTER TABLE rating
    ADD COLUMN IF NOT EXISTS post_id BIGINT;

DELETE
FROM rating
WHERE post_id IS NULL;

ALTER TABLE rating
    ALTER COLUMN post_id SET NOT NULL;

ALTER TABLE rating
    ADD CONSTRAINT uk_rating_post_rater_rated
        UNIQUE (post_id, rater_user_id, rated_user_id);