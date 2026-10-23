CREATE TABLE `mayorquestreward` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `questId` INT NOT NULL,
  `sortOrder` INT NOT NULL,
  `imagePath` VARCHAR(255) NOT NULL,
  `amount` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `mayorquestreward_questId_idx` (`questId`),
  CONSTRAINT `mayorquestreward_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `mayorquest`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
