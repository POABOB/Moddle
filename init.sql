CREATE TABLE `Users` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(128),
  `password` varchar(256),
  `name` varchar(64),
  `access_token` varchar(256),
  `provider` varchar(16),
  `totalScore` int
);

CREATE TABLE `History` (
  `history_id` int PRIMARY KEY AUTO_INCREMENT,
  `date` int,
  `score` tinyint,
  `times` tinyint,
  `user_id` int
);

CREATE TABLE `vocabulary` (
  `v_id` int PRIMARY KEY AUTO_INCREMENT,
  `value` varchar(64)
);

ALTER TABLE `History` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);