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

ALTER TABLE `user` ADD `upjersname` VARCHAR(255) NOT NULL AFTER `name`;
UPDATE `user` SET `upjersname` = 'Luna' WHERE `user`.`id` = 1;

ALTER TABLE `contest` CHANGE `active` `active` TINYINT(11) NOT NULL;

ALTER TABLE `contestdonation`
  DROP COLUMN `puzzlePiece`,
  ADD COLUMN `level` INT NOT NULL,
  ADD COLUMN `count` INT NOT NULL,
  ADD COLUMN `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

ALTER TABLE `animal` ADD `isContestAnimal` BOOLEAN NOT NULL DEFAULT FALSE AFTER `breedingProbability`, ADD `statueImage` VARCHAR(255) NULL AFTER `isContestAnimal`;

UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-afrikanischer-elefant.webp' WHERE `id` = 502;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-afrikanischer-esel.webp' WHERE `id` = 401;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-afrikanischer-strauss.webp' WHERE `id` = 503;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-alpaka.webp' WHERE `id` = 402;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-amerikanischer-bison.webp' WHERE `id` = 202;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-blauschopf-krontaube.webp' WHERE `id` = 304;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-breitmaulnashorn.webp' WHERE `id` = 506;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-eisbaer.webp' WHERE `id` = 703;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-elch.webp' WHERE `id` = 308;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-erdferkel.webp' WHERE `id` = 509;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-europaeischer-dachs.webp' WHERE `id` = 310;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-flamingo.webp' WHERE `id` = 211;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-flusspferd.webp' WHERE `id` = 512;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-grosse-anakonda.webp' WHERE `id` = 611;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-grosser-panda.webp' WHERE `id` = 107;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-guerteltier.webp' WHERE `id` = 216;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-hase.webp' WHERE `id` = 108;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-hausschwein.webp' WHERE `id` = 109;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-hausziege.webp' WHERE `id` = 110;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-hellroter-ara.webp' WHERE `id` = 614;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-kaiserpinguin.webp' WHERE `id` = 709;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-koala.webp' WHERE `id` = 322;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-kodiakbaer.webp' WHERE `id` = 418;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-komodowaran.webp' WHERE `id` = 621;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-loewe.webp' WHERE `id` = 520;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-luchs.webp' WHERE `id` = 420;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-mandrill.webp' WHERE `id` = 627;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-mondbaer.webp' WHERE `id` = 324;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-netzgiraffe.webp' WHERE `id` = 521;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-nilkrokodil.webp' WHERE `id` = 634;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-okapi.webp' WHERE `id` = 326;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-ozelot.webp' WHERE `id` = 423;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-panter.webp' WHERE `id` = 638;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-pavian.webp' WHERE `id` = 424;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-pfau.webp' WHERE `id` = 224;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-pferd.webp' WHERE `id` = 124;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-polarfuchs.webp' WHERE `id` = 713;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-polarwolf.webp' WHERE `id` = 714;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-riesenschildkroete.webp' WHERE `id` = 227;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-riesen-tukan.webp' WHERE `id` = 641;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-roter-panda.webp' WHERE `id` = 329;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-rotes-riesenkanguru.webp' WHERE `id` = 229;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-rotfuchs.webp' WHERE `id` = 331;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-schaf.webp' WHERE `id` = 128;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-schimpanse.webp' WHERE `id` = 332;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-schneehase.webp' WHERE `id` = 717;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-sekretaer.webp' WHERE `id` = 232;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-steppenzebra.webp' WHERE `id` = 237;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-tapir.webp' WHERE `id` = 136;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-weisskopfadler.webp' WHERE `id` = 430;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-wildschwein.webp' WHERE `id` = 340;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-wolf.webp' WHERE `id` = 431;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-bieber.webp' WHERE `id` = 103;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-mandarinente.webp' WHERE `id` = 819;
UPDATE `animal` SET `isContestAnimal` = TRUE, `statueImage` = 'statue-schneeeule.webp' WHERE `id` = 715;

ALTER TABLE `statue` DROP INDEX `statue_animalId_key`;
ALTER TABLE `conteststatue` CHANGE `statueId` `animalId` INT(11) NOT NULL;
DROP TABLE `statuetext`;
DROP TABLE `statue`;