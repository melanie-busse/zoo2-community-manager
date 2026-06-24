/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `specialcoatstext` (
  `id` int NOT NULL AUTO_INCREMENT,
  `specialCoatId` int NOT NULL,
  `languageCode` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `specialCoatsText_specialCoatId_languageCode_key` (`specialCoatId`,`languageCode`),
  CONSTRAINT `specialCoatsText_specialCoatId_fkey` FOREIGN KEY (`specialCoatId`) REFERENCES `specialcoat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30002;
