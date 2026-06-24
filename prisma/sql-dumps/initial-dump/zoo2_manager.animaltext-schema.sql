/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `animaltext` (
  `id` int NOT NULL AUTO_INCREMENT,
  `animalId` int NOT NULL,
  `languageCode` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `animalName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `animalDescription` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `animalText_animalId_languageCode_key` (`animalId`,`languageCode`),
  CONSTRAINT `animalText_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `animal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=120002;
