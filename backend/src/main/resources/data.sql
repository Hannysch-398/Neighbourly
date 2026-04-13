INSERT INTO users (email, password, email_verified)
VALUES ('ranim@test.com', '123456', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password, email_verified)
VALUES ('test@test.com', 'password', false)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password, email_verified)
VALUES ('user@example.com', 'abc123', true)
ON CONFLICT (email) DO NOTHING;