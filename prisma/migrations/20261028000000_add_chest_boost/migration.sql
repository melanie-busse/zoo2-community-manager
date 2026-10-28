-- CreateEnum
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` VARCHAR(36) NOT NULL,
  `checksum` VARCHAR(64) NOT NULL,
  `finished_at` DATETIME(3),
  `migration_name` VARCHAR(255) NOT NULL,
  `logs` TEXT,
  `rolled_back_at` DATETIME(3),
  `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateEnum for ChestType
-- MySQL does not have native enums in Prisma migrations like PostgreSQL;
-- Prisma handles MySQL enums inline on the column.

-- CreateTable
CREATE TABLE `chestboost` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `startDate` DATETIME(3) NOT NULL,
  `endDate` DATETIME(3) NOT NULL,
  `chestType` ENUM('EPIC', 'RETRO', 'LEGENDARY') NOT NULL,
  `isEvent` BOOLEAN NOT NULL DEFAULT false,
  `animalId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `chestboost_animalId_idx` (`animalId`),
  CONSTRAINT `chestboost_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `animal` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
