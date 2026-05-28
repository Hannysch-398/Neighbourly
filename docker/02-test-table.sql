CREATE TABLE test_table
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO test_table(name)
VALUES ('Yasin'),
       ('MaximilianAlexanderVonHabsburgLothringenDerDritte'),
       ('李小龍'),
       ('Jean-Luca Picard'),
       ('   Anna   '),
       ('😈🔥💀'),
       ('');

SELECT id, name FROM test_table;