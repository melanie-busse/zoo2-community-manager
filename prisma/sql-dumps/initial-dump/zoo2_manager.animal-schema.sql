/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `animal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `releaseDate` datetime(3) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `priceTypeId` int DEFAULT NULL,
  `sellingPrice` int DEFAULT NULL,
  `popularity` int DEFAULT NULL,
  `releaseExp` int DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biomeId` int NOT NULL,
  `size` int DEFAULT NULL,
  `gameId` int DEFAULT NULL,
  `shelterLevel` int DEFAULT NULL,
  `breedingCost` int DEFAULT NULL,
  `breedingDuration` int DEFAULT NULL,
  `breedingProbability` int DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `animal_biomeId_fkey` (`biomeId`),
  KEY `animal_priceTypeId_fkey` (`priceTypeId`),
  CONSTRAINT `animal_priceTypeId_fkey` FOREIGN KEY (`priceTypeId`) REFERENCES `pricetype` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `animal_biomeId_fkey` FOREIGN KEY (`biomeId`) REFERENCES `biome` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=60102;
