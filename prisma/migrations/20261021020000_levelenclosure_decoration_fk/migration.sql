ALTER TABLE `levelenclosureitem`
  ADD COLUMN `biomeDecorationId` INT NULL,
  ADD COLUMN `biomeGameId` INT NULL,
  ADD CONSTRAINT `levelenclosureitem_biomeDecorationId_fkey` FOREIGN KEY (`biomeDecorationId`) REFERENCES `biomedecoration`(`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `levelenclosureitem_biomeGameId_fkey` FOREIGN KEY (`biomeGameId`) REFERENCES `biomegame`(`id`) ON DELETE SET NULL;
