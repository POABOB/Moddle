CREATE DATABASE IF NOT EXISTS wordle character set utf8 collate utf8_unicode_ci;
USE wordle;
CREATE TABLE IF NOT EXISTS `Users` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(128),
  `password` varchar(256),
  `name` varchar(64),
  `access_token` varchar(256),
  `provider` varchar(16),
  `totalScore` int
);

CREATE TABLE IF NOT EXISTS `History` (
  `history_id` int PRIMARY KEY AUTO_INCREMENT,
  `date` int,
  `score` tinyint,
  `times` tinyint,
  `user_id` int
);

CREATE TABLE IF NOT EXISTS `vocabulary` (
  `v_id` int PRIMARY KEY AUTO_INCREMENT,
  `value` varchar(64)
);

ALTER TABLE IF NOT EXISTS `History` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);