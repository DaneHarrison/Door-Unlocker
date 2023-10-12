CREATE TABLE friends (
    friend_id       SERIAL PRIMARY KEY,
    friend_name     VARCHAR NOT NULL UNIQUE,
    email           VARCHAR NOT NULL UNIQUE,
    access_lvl      VARCHAR DEFAULT 'not allowed',
    last_accessed   DATE,

    CONSTRAINT chk_friend_access_lvl CHECK (access_lvl IN ('locked', 'not allowed', 'allowed', 'admin'))
);

CREATE TABLE sessions (
    session_id  VARCHAR PRIMARY KEY,
    friend_id   INT,
    access_lvl  VARCHAR,

    FOREIGN KEY (friend_id) REFERENCES friends(friend_id),
    CONSTRAINT chk_session_access_Lvl CHECK (access_lvl IN ('locked', 'not allowed', 'allowed', 'admin'))
);

CREATE TABLE query_logs (
    query_id        SERIAL PRIMARY KEY,
    query           VARCHAR,
    params          VARCHAR[],
    duration        FLOAT,
    date_occured    DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE action_logs (
    action_id       SERIAL PRIMARY KEY, 
    user_id         INT,
    action_occured  VARCHAR,
    success         BOOLEAN,
    details         VARCHAR,
    date_occured    DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE error_logs (
    error_id        SERIAL PRIMARY KEY,
    msg             VARCHAR,
    file_occured    VARCHAR,
    func_occured    VARCHAR,
    date_occured    DATE NOT NULL DEFAULT CURRENT_DATE   
);