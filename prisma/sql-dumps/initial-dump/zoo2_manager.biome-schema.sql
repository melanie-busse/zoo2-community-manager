/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `biome` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int DEFAULT NULL,
  `priceTypeId` int DEFAULT NULL,
  `expansionsCost` int DEFAULT NULL,
  `priceTypeExpansionsCostId` int DEFAULT NULL,
  `size` int DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identifier` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `biomeindex` (`id`),
  KEY `biome_priceTypeId_fkey` (`priceTypeId`),
  UNIQUE KEY `biome_identifier_key` (`identifier`),
  CONSTRAINT `biome_priceTypeId_fkey` FOREIGN KEY (`priceTypeId`) REFERENCES `pricetype` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30101;
