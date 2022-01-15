CREATE SCHEMA pseudonymes;
CREATE TABLE pseudonymes.pseudo (
    name                VARCHAR(3) PRIMARY KEY,
    previous_value      VARCHAR(3) UNIQUE,
    previous_value_used BOOLEAN,
    next_value          VARCHAR(3) UNIQUE,
    next_value_used     BOOLEAN
);

CREATE UNIQUE INDEX unique_previous_value_asc_idx ON pseudonymes.pseudo(previous_value ASC);
CREATE UNIQUE INDEX unique_next_value_asc_idx ON pseudonymes.pseudo(next_value ASC);
CREATE INDEX partial_previous_value_used_false_idx ON pseudonymes.pseudo(previous_value_used) WHERE previous_value_used = FALSE;
CREATE INDEX partial_next_value_used_false_idx ON pseudonymes.pseudo(next_value_used) WHERE next_value_used = FALSE;