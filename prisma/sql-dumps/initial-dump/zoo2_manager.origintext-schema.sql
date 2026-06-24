/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `origintext` (
  `id` int NOT NULL AUTO_INCREMENT,
  `originId` int NOT NULL,
  `languageCode` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `originName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `originDescription` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `originText_originId_languageCode_key` (`originId`,`languageCode`),
  CONSTRAINT `originText_originId_fkey` FOREIGN KEY (`originId`) REFERENCES `origin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30002;
