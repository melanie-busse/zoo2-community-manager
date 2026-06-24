/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `specialcoat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `animalId` int NOT NULL,
  `coatColor` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `originId` int NOT NULL,
  `releaseDate` datetime(3) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `specialCoatesindex` (`id`),
  KEY `specialCoat_animalId_idx` (`animalId`),
  KEY `specialCoat_originId_fkey` (`originId`),
  CONSTRAINT `specialCoat_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `animal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `specialCoat_originId_fkey` FOREIGN KEY (`originId`) REFERENCES `origin` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30002;
