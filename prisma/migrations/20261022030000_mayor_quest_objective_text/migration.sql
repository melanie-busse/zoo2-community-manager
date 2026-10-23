CREATE TABLE `mayorquestobjectivetext` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `objectiveId` INT NOT NULL,
  `languageCode` VARCHAR(5) NOT NULL,
  `text` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mayorquestobjectivetext_objectiveId_languageCode_key` (`objectiveId`, `languageCode`),
  INDEX `mayorquestobjectivetext_objectiveId_idx` (`objectiveId`),
  CONSTRAINT `mayorquestobjectivetext_objectiveId_fkey` FOREIGN KEY (`objectiveId`) REFERENCES `mayorquestobjective`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
