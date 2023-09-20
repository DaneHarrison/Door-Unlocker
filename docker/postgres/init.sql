CREATE TABLE friends (
    friend_id       SERIAL PRIMARY KEY,
    name            VARCHAR,
    email           VARCHAR,
    role            VARCHAR,
    last_accessed   DATE,

    CONSTRAINT chk_friend_role CHECK (role IN ('not allowed', 'allowed', 'admin', 'locked'))
);

CREATE TABLE sessions (
    session_id  PRIMARY KEY,
    friend_id   INT,
    role        VARCHAR,

    FOREIGN KEY (friend_id) REFERENCES friends(friend_id),
    CONSTRAINT chk_session_role CHECK (role IN ('not allowed', 'allowed', 'admin', 'locked'))
);

CREATE TABLE query_logs (
    query_id    SERIAL PRIMARY KEY,
    query       VARCHAR,
    params      VARCHAR[],
    duration    FLOAT,
    date        DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE action_logs (
    action_id   SERIAL PRIMARY KEY, 
    user_id     INT,
    action      VARCHAR,
    success     BOOLEAN,
    date        DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE error_logs (
    error_id    SERIAL PRIMARY KEY,
    error       VARCHAR,
    file        VARCHAR,
    function    VARCHAR,
    date        DATE NOT NULL DEFAULT CURRENT_DATE   
);