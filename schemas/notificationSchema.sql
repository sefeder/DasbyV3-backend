-- USE qlujzj1v8xhmckv0; or USE dasby_db

CREATE TABLE notifications
(
    id INT NOT NULL AUTO_INCREMENT,
    upi varchar(255),
    surveyType int(11) DEFAULT NULL,
	surveyName varchar(255) DEFAULT NULL,
	notifyCount int(11) DEFAULT NULL,
	lastContact timestamp NULL DEFAULT NULL,
    createdAt timestamp NULL DEFAULT NULL,
    updatedAt timestamp NULL DEFAULT NULL,
    PRIMARY KEY (id)
);
