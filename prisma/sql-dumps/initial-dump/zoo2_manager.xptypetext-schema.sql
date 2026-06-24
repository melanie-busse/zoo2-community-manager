/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `xptypetext` (
  `id` int NOT NULL AUTO_INCREMENT,
  `xpTypeId` int NOT NULL,
  `languageCode` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `xpTypeText_xpTypeId_languageCode_key` (`xpTypeId`,`languageCode`),
  CONSTRAINT `xpTypeText_xpTypeId_fkey` FOREIGN KEY (`xpTypeId`) REFERENCES `xptype` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30002;
