/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `animalorigin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `animalId` int NOT NULL,
  `originId` int NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `originindex` (`id`),
  KEY `animalOrigin_animalId_idx` (`animalId`),
  KEY `animalOrigin_originId_idx` (`originId`),
  CONSTRAINT `animalOrigin_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `animal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `animalOrigin_originId_fkey` FOREIGN KEY (`originId`) REFERENCES `origin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=91002;
