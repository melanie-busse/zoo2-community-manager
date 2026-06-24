/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `pricetypetext` (
  `id` int NOT NULL AUTO_INCREMENT,
  `priceTypeId` int NOT NULL,
  `languageCode` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priceTypeName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `priceTypeText_priceTypeId_languageCode_key` (`priceTypeId`,`languageCode`),
  CONSTRAINT `priceTypeText_priceTypeId_fkey` FOREIGN KEY (`priceTypeId`) REFERENCES `pricetype` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30002;
