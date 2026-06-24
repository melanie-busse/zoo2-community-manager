/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `contestdonation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contestId` int NOT NULL,
  `userId` int NOT NULL,
  `animalId` int NOT NULL,
  `count` int NOT NULL,
  `createdat` datetime(3) NOT NULL,
  `level` int NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `contestDonation_animalId_fkey` (`animalId`),
  KEY `contestDonation_contestId_idx` (`contestId`),
  KEY `contestDonation_userId_idx` (`userId`),
  CONSTRAINT `contestDonation_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `animal` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `contestDonation_contestId_fkey` FOREIGN KEY (`contestId`) REFERENCES `contest` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contestDonation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
