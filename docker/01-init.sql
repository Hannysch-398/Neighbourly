CREATE ROLE neighbourly_readwrite NOLOGIN;

GRANT CONNECT ON DATABASE neighbourly TO neighbourly_readwrite;
GRANT USAGE ON SCHEMA public TO neighbourly_readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO neighbourly_readwrite;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO neighbourly_readwrite;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO neighbourly_readwrite;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO neighbourly_readwrite;

CREATE ROLE neighbourly_app LOGIN PASSWORD 'dev';
CREATE ROLE akram_dev LOGIN PASSWORD 'akram123';
CREATE ROLE alena_dev LOGIN PASSWORD 'alena123';
CREATE ROLE dylan_dev LOGIN PASSWORD 'dylan123';
CREATE ROLE hanna_dev LOGIN PASSWORD 'hanna123';
CREATE ROLE hannah_dev LOGIN PASSWORD 'hannah123';
CREATE ROLE ranim_dev LOGIN PASSWORD 'ranim123';
CREATE ROLE yasin_dev LOGIN PASSWORD 'yasin123';
CREATE ROLE zakaria_dev LOGIN PASSWORD 'zakaria123';

GRANT neighbourly_readwrite TO neighbourly_app;
GRANT neighbourly_readwrite TO akram_dev;
GRANT neighbourly_readwrite TO alena_dev;
GRANT neighbourly_readwrite TO dylan_dev;
GRANT neighbourly_readwrite TO hanna_dev;
GRANT neighbourly_readwrite TO hannah_dev;
GRANT neighbourly_readwrite TO ranim_dev;
GRANT neighbourly_readwrite TO yasin_dev;
GRANT neighbourly_readwrite TO zakaria_dev;