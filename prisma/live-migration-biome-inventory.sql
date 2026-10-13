-- Biome Inventory tables
CREATE TABLE IF NOT EXISTS `zooinventorybiome` (
  `id`            INT          NOT NULL AUTO_INCREMENT,
  `userid`        INT          NOT NULL,
  `biomeId`       INT          NOT NULL,
  `enclosure`     TINYINT(1)   NOT NULL DEFAULT 0,
  `trough`        TINYINT(1)   NOT NULL DEFAULT 0,
  `waterHole`     TINYINT(1)   NOT NULL DEFAULT 0,
  `shelterLevel0` INT          NOT NULL DEFAULT 0,
  `shelterLevel1` INT          NOT NULL DEFAULT 0,
  `shelterLevel2` INT          NOT NULL DEFAULT 0,
  `shelterLevel3` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `zooinventorybiome_userid_biomeId_key` (`userid`, `biomeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `zooinventorybiomegame` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `userid`      INT NOT NULL,
  `biomeGameId` INT NOT NULL,
  `count`       INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `zooinventorybiomegame_userid_biomeGameId_key` (`userid`, `biomeGameId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
