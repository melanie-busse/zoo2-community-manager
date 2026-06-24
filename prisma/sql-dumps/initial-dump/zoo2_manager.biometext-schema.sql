/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `biometext` (
  `id` int NOT NULL AUTO_INCREMENT,
  `biomeId` int NOT NULL,
  `languageCode` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biomeName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biomeDescription` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `biomesText_biomeId_languageCode_key` (`biomeId`,`languageCode`),
  CONSTRAINT `biomesText_biomeId_fkey` FOREIGN KEY (`biomeId`) REFERENCES `biome` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30002;
