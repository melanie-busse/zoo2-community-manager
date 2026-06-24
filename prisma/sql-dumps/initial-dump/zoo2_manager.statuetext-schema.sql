/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `statuetext` (
  `id` int NOT NULL AUTO_INCREMENT,
  `statueId` int NOT NULL,
  `languageCode` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statueName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `statueText_statueId_languageCode_key` (`statueId`,`languageCode`),
  CONSTRAINT `statueText_statueId_fkey` FOREIGN KEY (`statueId`) REFERENCES `statue` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
