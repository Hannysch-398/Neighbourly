ALTER TABLE post_locations
    ADD COLUMN postal_code VARCHAR(255);

ALTER TABLE post_locations
    ADD COLUMN address VARCHAR(500);

ALTER TABLE post_locations
    DROP COLUMN district;