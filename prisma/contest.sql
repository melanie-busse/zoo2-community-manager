ALTER TABLE `specialcoat` ADD `isContestSpecialCoat` BOOLEAN NOT NULL DEFAULT FALSE AFTER `image`;

CREATE TABLE `contestspecialcoat` (
  `id`            INT          NOT NULL AUTO_INCREMENT,
  `contestId`     INT          NOT NULL,
  `specialCoatId` INT          NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `contestSpecialCoat_contestId_idx` (`contestId`),
  INDEX `contestSpecialCoat_specialCoatId_idx` (`specialCoatId`),
  CONSTRAINT `contestSpecialCoat_contestId_fkey`
    FOREIGN KEY (`contestId`) REFERENCES `contest` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contestSpecialCoat_specialCoatId_fkey`
    FOREIGN KEY (`specialCoatId`) REFERENCES `specialcoat` (`id`) ON DELETE CASCADE
);

UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 16;
UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 27;
UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 35;
UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 37;
UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 46;
UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 62;
UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 64;
UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 66;
UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 79;
UPDATE `specialcoat` SET `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 83;
UPDATE `specialcoat` SET `image` = 'american_BlackBear.jpg', `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 132;
UPDATE `specialcoat` SET `image` = 'fishing_cat.jpg', `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 133;
UPDATE `specialcoat` SET `image` = 'Pavian.jpg', `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 134;
UPDATE `specialcoat` SET `image` = 'Komodowaran.jpg', `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 137;
UPDATE `specialcoat` SET `image` = 'Schneeschaf.jpg', `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 138;
UPDATE `specialcoat` SET `image` = 'Hamster', `isContestSpecialCoat` = '1' WHERE `specialcoat`.`id` = 140;