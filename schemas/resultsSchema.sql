-- USE qlujzj1v8xhmckv0; or USE dasby_db

DROP TABLE IF EXISTS `results`;

CREATE TABLE `results` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL DEFAULT '',
  `interviewId` varchar(255) NOT NULL DEFAULT '',
  `testType` varchar(255) DEFAULT NULL,
  `diagnosis` varchar(255) DEFAULT NULL,
  `confidence` varchar(255) DEFAULT NULL,
  `severity` double DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `precision` double DEFAULT NULL,
  `probability` double DEFAULT NULL,
  `percentile` double DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
  )