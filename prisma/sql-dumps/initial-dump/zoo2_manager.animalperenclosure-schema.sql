/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `animalperenclosure` (
  `animalId` int NOT NULL,
  `numberAnimals` int NOT NULL,
  `numberEnclosure` int NOT NULL,
  PRIMARY KEY (`animalId`,`numberAnimals`) /*T![clustered_index] CLUSTERED */,
  CONSTRAINT `animalPerEnclosure_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `animal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
