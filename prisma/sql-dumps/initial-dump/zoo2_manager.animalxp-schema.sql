/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `animalxp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `animalId` int NOT NULL,
  `xpTypeId` int NOT NULL,
  `xpValue` int DEFAULT NULL,
  `xpDuration` int DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `xpindex` (`id`),
  KEY `animalXp_animalId_idx` (`animalId`),
  KEY `animalXp_xpTypeId_idx` (`xpTypeId`),
  CONSTRAINT `animalXp_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `animal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `animalXp_xpTypeId_fkey` FOREIGN KEY (`xpTypeId`) REFERENCES `xptype` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=151002;
