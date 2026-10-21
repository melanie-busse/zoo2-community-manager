-- Make rewardAnimalId nullable (was NOT NULL from previous db push)
ALTER TABLE `collection` MODIFY COLUMN `rewardAnimalId` INT NULL;
