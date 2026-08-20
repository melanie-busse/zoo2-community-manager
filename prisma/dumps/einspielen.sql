-- 1. Tabelle: animal
ALTER TABLE `animal`
    ADD COLUMN `isContestAnimal` BOOLEAN      NOT NULL DEFAULT FALSE,
    ADD COLUMN `statueImage`     VARCHAR(255) NULL;

-- 2. Tabelle: contestdonation
ALTER TABLE `contestdonation`
    ADD COLUMN `level`     INT      NULL,
    ADD COLUMN `count`     INT      NOT NULL DEFAULT 0,
    ADD COLUMN `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 3. Tabelle: conteststatue
ALTER TABLE `conteststatue`
    ADD COLUMN `animalId` INT NULL,
    ADD CONSTRAINT `fk_conteststatue_animal`
        FOREIGN KEY (`animalId`) REFERENCES `animal` (`id`)
            ON DELETE SET NULL ON UPDATE CASCADE;

-- 4. Tabelle: origin
ALTER TABLE `origin`
    ADD COLUMN `wiki_icon_name` VARCHAR(255) NULL;

-- 5. Tabelle: specialcoat
ALTER TABLE `specialcoat`
    ADD COLUMN `isContestSpecialCoat` BOOLEAN NOT NULL DEFAULT FALSE;

-- 6. Tabelle: user
ALTER TABLE `user`
    ADD COLUMN `upjersname` VARCHAR(100) NULL;

-- 7. Tabelle: contestspecialcoat
DROP TABLE IF EXISTS `contestspecialcoat`;
CREATE TABLE `contestspecialcoat`
(
    `id`            int(11) NOT NULL AUTO_INCREMENT,
    `contestId`     int(11) NOT NULL,
    `specialCoatId` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `contestSpecialCoat_contestId_idx` (`contestId`),
    KEY `contestSpecialCoat_specialCoatId_idx` (`specialCoatId`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

INSERT INTO `contestspecialcoat` (`id`, `contestId`, `specialCoatId`)
VALUES (5, 150009, 35);

-- 8. Tabelle: region
DROP TABLE IF EXISTS `region`;
CREATE TABLE `region`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `price`       int(11)      NOT NULL,
    `terrainid`   int(11)      NOT NULL,
    `releasedate` datetime(3)  NOT NULL,
    `unlocklevel` int(11)      NOT NULL,
    `identifier`  varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

INSERT INTO `region` (`id`, `price`, `terrainid`, `releasedate`, `unlocklevel`, `identifier`)
VALUES (1, 0, 100, '2018-03-27 00:00:00.000', 0, 'MainZoo'),
       (2, 50, 300, '2021-03-03 00:00:00.000', 30, 'FirGrove'),
       (3, 100, 500, '2022-03-22 00:00:00.000', 40, 'KujaliPark'),
       (4, 100, 600, '2025-11-25 00:00:00.000', 45, 'RainforestPark'),
       (5, 100, 700, '2024-11-26 00:00:00.000', 55, 'PolarPark'),
       (6, 150, 800, '2023-11-21 00:00:00.000', 70, 'OceansideZoo'),
       (7, 75, 0, '2021-10-12 00:00:00.000', 30, 'Terrarium'),
       (8, 75, 0, '2023-02-21 00:00:00.000', 50, 'Aquarium'),
       (9, 125, 0, '2024-03-07 00:00:00.000', 80, 'NoctanalHouse'),
       (10, 150, 0, '2026-04-21 00:00:00.000', 90, 'Aviary'),
       (11, 190, 0, '2025-05-20 00:00:00.000', 100, 'RescueCenter');

-- 9. Tabelle: regiontext
DROP TABLE IF EXISTS `regiontext`;
CREATE TABLE `regiontext`
(
    `id`           int(11)      NOT NULL AUTO_INCREMENT,
    `regionid`     int(11)      NOT NULL,
    `languageCode` varchar(255) NOT NULL,
    `name`         varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `regiontext_regionid_fkey` (`regionid`),
    CONSTRAINT `fk_regiontext_region`
        FOREIGN KEY (`regionid`) REFERENCES `region` (`id`)
            ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

INSERT INTO `regiontext` (`id`, `regionid`, `languageCode`, `name`)
VALUES (1, 1, 'da', 'Hovedzoo'),
       (2, 1, 'en', 'Main Zoo'),
       (3, 1, 'fr', 'Zoo principal'),
       (4, 1, 'es', 'Zoo principal'),
       (5, 1, 'nl', 'Hoofdzoo'),
       (6, 2, 'da', 'Granskov'),
       (7, 2, 'en', 'Fir Grove'),
       (8, 2, 'fr', 'Bosquet de sapins'),
       (9, 2, 'es', 'Arboleda de abetos'),
       (10, 2, 'nl', 'Sparrenbos'),
       (11, 3, 'da', 'Kujali Park'),
       (12, 3, 'en', 'Kujali Park'),
       (13, 3, 'fr', 'Parc Kujali'),
       (14, 3, 'es', 'Parque Kujali'),
       (15, 3, 'nl', 'Kujali Park'),
       (16, 4, 'da', 'Regnskovspark'),
       (17, 4, 'en', 'Rainforest Park'),
       (18, 4, 'fr', 'Parc de la forêt tropicale'),
       (19, 4, 'es', 'Parque de la selva'),
       (20, 4, 'nl', 'Regenwoudpark'),
       (21, 5, 'da', 'Polarpark'),
       (22, 5, 'en', 'Polar Park'),
       (23, 5, 'fr', 'Parc polaire'),
       (24, 5, 'es', 'Parque polar'),
       (25, 5, 'nl', 'Poolpark'),
       (26, 6, 'da', 'Kystzoo'),
       (27, 6, 'en', 'Oceanside Zoo'),
       (28, 6, 'fr', 'Zoo du littoral'),
       (29, 6, 'es', 'Zoo costero'),
       (30, 6, 'nl', 'Kustzoo'),
       (31, 7, 'da', 'Terrarium'),
       (32, 7, 'en', 'Terrarium'),
       (33, 7, 'fr', 'Terrarium'),
       (34, 7, 'es', 'Terrario'),
       (35, 7, 'nl', 'Terrarium'),
       (36, 8, 'da', 'Akvarium'),
       (37, 8, 'en', 'Aquarium'),
       (38, 8, 'fr', 'Aquarium'),
       (39, 8, 'es', 'Acuario'),
       (40, 8, 'nl', 'Aquarium'),
       (41, 9, 'da', 'Nattehus'),
       (42, 9, 'en', 'Nocturnal House'),
       (43, 9, 'fr', 'Maison nocturne'),
       (44, 9, 'es', 'Casa nocturna'),
       (45, 9, 'nl', 'Nachtdierenhuis'),
       (46, 10, 'da', 'Voliere'),
       (47, 10, 'en', 'Aviary'),
       (48, 10, 'fr', 'Volière'),
       (49, 10, 'es', 'Pajarera'),
       (50, 10, 'nl', 'Volière'),
       (51, 11, 'da', 'Redningscenter'),
       (52, 11, 'en', 'Rescue Center'),
       (53, 11, 'fr', 'Centre de sauvetage'),
       (54, 11, 'es', 'Centro de rescate'),
       (55, 11, 'nl', 'Reddingscentrum'),
       (56, 1, 'de', 'Hauptzoo'),
       (57, 2, 'de', 'Tannenhain'),
       (58, 3, 'de', 'Kujali Park'),
       (59, 4, 'de', 'Regenwaldpark'),
       (60, 5, 'de', 'Polarpark'),
       (61, 6, 'de', 'Küstenzoo'),
       (62, 7, 'de', 'Terrarium'),
       (63, 8, 'de', 'Aquarium'),
       (64, 9, 'de', 'Nachttierhaus'),
       (65, 10, 'de', 'Aviarium'),
       (66, 11, 'de', 'Auffangstation');

-- 10. Tabelle: zooinventoryspecialcoat
DROP TABLE IF EXISTS `zooinventoryspecialcoat`;
CREATE TABLE `zooinventoryspecialcoat`
(
    `id`            int(11) NOT NULL AUTO_INCREMENT,
    `specialcoatid` int(11) NOT NULL,
    `userid`        int(11) NOT NULL,
    `count`         int(11)    DEFAULT NULL,
    `level10`       tinyint(1) DEFAULT NULL,
    `level20`       tinyint(1) DEFAULT NULL,
    `glitteranimal` tinyint(4) DEFAULT NULL,
    `regionId`      int(11)    DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `zooinventoryspecialcoat_specialcoatid_fkey` (`specialcoatid`),
    KEY `zooinventoryspecialcoat_userid_fkey` (`userid`),
    KEY `zooinventoryspecialcoat_regionId_fkey` (`regionId`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;