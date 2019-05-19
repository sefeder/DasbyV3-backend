-- USE qlujzj1v8xhmckv0; or USE dasby_db

CREATE TABLE `physicians` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(250) NOT NULL,
  `last_name` VARCHAR (250) NOT NULL,
  `email` VARCHAR (250) NOT NULL,
  `password` VARCHAR (250) NOT NULL,
  `hospital` VARCHAR (250) NOT NULL,
  `upi` VARCHAR (250) NOT NULL,
  `private_key` VARCHAR (250) NOT NULL,
  PRIMARY KEY (`id`)
) 
