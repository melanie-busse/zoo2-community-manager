ALTER TABLE `animal` ADD COLUMN IF NOT EXISTS `biomeGameId` INT NULL;
ALTER TABLE `animal` ADD INDEX IF NOT EXISTS `animal_biomeGameId_fkey` (`biomeGameId`);
