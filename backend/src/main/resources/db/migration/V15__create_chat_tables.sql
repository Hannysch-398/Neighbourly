CREATE TABLE conversations
(
    id         BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE conversation_participants
(
    id              BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT    NOT NULL,
    user_id         BIGINT    NOT NULL,
    joined_at       TIMESTAMP NOT NULL,

    CONSTRAINT fk_conversation_participants_conversation
        FOREIGN KEY (conversation_id)
            REFERENCES conversations (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_conversation_participants_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_conversation_participant
        UNIQUE (conversation_id, user_id)
);

CREATE TABLE messages
(
    id              BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT        NOT NULL,
    sender_user_id  BIGINT        NOT NULL,
    content         VARCHAR(2000) NOT NULL,
    created_at      TIMESTAMP     NOT NULL,

    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id)
            REFERENCES conversations (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_messages_sender_user
        FOREIGN KEY (sender_user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);