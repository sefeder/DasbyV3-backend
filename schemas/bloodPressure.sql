-- USE qlujzj1v8xhmckv0; or USE dasby_db

CREATE TABLE bloodPressure
(
    id INT NOT NULL AUTO_INCREMENT,
    upi varchar(255),
    systolic int(11) NOT NULL,
    diastolic int(11) NOT NULL,
    createdAt timestamp NULL DEFAULT NULL,
    updatedAt timestamp NULL DEFAULT NULL,
    PRIMARY KEY (id)
);
