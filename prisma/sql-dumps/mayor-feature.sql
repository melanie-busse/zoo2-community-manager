INSERT INTO `role` (`id`, `name`)
VALUES (0, 'Mayor');

INSERT INTO `rolestext` (`roleId`, `languageCode`, `roleName`)
VALUES (0, 'de', 'Bürgermeister'),
       (0, 'en', 'Mayor'),
       (0, 'da', 'Borgmester'),
       (0, 'nl', 'Burgemeester'),
       (0, 'fr', 'Maire'),
       (0, 'es', 'Alcalde');

INSERT INTO `user` (`id`, `name`, `email`, `image`, `roleId`, `last_login`, `discordId`)
VALUES (2, 'Mayor', 'mayor@melanie-busse.de', '', 0, '2026-07-11 08:47:13', '1234567890');