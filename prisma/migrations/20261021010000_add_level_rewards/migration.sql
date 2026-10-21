CREATE TABLE `levelreward` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `level` INTEGER NOT NULL,
  `coins` INTEGER NULL,
  `diamonds` INTEGER NULL,
  `zooItems` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `levelreward_level_key`(`level`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `levelenclosureitem` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `levelId` INTEGER NOT NULL,
  `quantity` INTEGER NOT NULL DEFAULT 1,
  `name` VARCHAR(100) NOT NULL,
  `biomeIdentifier` VARCHAR(100) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `levelenclosureitem_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `levelreward`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `levelchest` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `levelId` INTEGER NOT NULL,
  `quantity` INTEGER NOT NULL DEFAULT 1,
  `chestType` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `levelchest_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `levelreward`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `levelanimalreward` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `levelId` INTEGER NOT NULL,
  `quantity` INTEGER NOT NULL DEFAULT 1,
  `animalId` INTEGER NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `levelanimalreward_animalId_idx`(`animalId`),
  CONSTRAINT `levelanimalreward_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `levelreward`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `levelanimalreward_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `animal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
