-- USE qlujzj1v8xhmckv0; or USE dasby_db

CREATE TABLE users
(
    id INT NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    hospital varchar(255) NOT NULL DEFAULT 'UChicago',
    upi varchar(255),
    private_key varchar(255),
    role varchar(255) NOT NULL DEFAULT 'user',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id)
);