-- Create levelrewardtext table
CREATE TABLE `levelrewardtext` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `levelId` INT NOT NULL,
  `languageCode` VARCHAR(5) NOT NULL,
  `zooItems` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `levelrewardtext_levelId_languageCode_key` (`levelId`, `languageCode`),
  INDEX `levelrewardtext_levelId_idx` (`levelId`),
  CONSTRAINT `levelrewardtext_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `levelreward`(`id`) ON DELETE CASCADE
);

-- Copy existing English zooItems values into the new text table
INSERT INTO `levelrewardtext` (`levelId`, `languageCode`, `zooItems`)
SELECT `id`, 'en', `zooItems`
FROM `levelreward`
WHERE `zooItems` IS NOT NULL;

-- Remove zooItems column from levelreward
ALTER TABLE `levelreward` DROP COLUMN `zooItems`;
