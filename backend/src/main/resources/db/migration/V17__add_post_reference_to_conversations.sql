ALTER TABLE conversations
    ADD COLUMN post_id BIGINT;

ALTER TABLE conversations
    ADD CONSTRAINT fk_conversations_post
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE;