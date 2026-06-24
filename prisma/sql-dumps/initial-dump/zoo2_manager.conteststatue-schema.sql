/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `conteststatue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contestId` int NOT NULL,
  `statueId` int NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `contestStatue_contestId_fkey` (`contestId`),
  KEY `contestStatue_statueId_fkey` (`statueId`),
  CONSTRAINT `contestStatue_contestId_fkey` FOREIGN KEY (`contestId`) REFERENCES `contest` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contestStatue_statueId_fkey` FOREIGN KEY (`statueId`) REFERENCES `statue` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=210001;
