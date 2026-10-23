CREATE TABLE `mayorquest` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sortOrder` INT NOT NULL,
  `titleName` VARCHAR(255) NOT NULL,
  `level` INT NOT NULL,
  `coinReward` INT NOT NULL,
  `xpReward` INT NOT NULL,
  `miscReward` TEXT NOT NULL,
  `questName` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mayorquest_sortOrder_key` (`sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `mayorquestobjective` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `questId` INT NOT NULL,
  `sortOrder` INT NOT NULL,
  `text` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `mayorquestobjective_questId_idx` (`questId`),
  CONSTRAINT `mayorquestobjective_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `mayorquest`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
