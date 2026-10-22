CREATE TABLE `mayorquesttext` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `questId` INT NOT NULL,
  `languageCode` VARCHAR(5) NOT NULL,
  `titleName` VARCHAR(255) NOT NULL,
  `miscReward` TEXT NOT NULL,
  `questName` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mayorquesttext_questId_languageCode_key` (`questId`, `languageCode`),
  INDEX `mayorquesttext_questId_idx` (`questId`),
  CONSTRAINT `mayorquesttext_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `mayorquest`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
