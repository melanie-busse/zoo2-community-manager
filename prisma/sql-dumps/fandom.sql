ALTER TABLE `specialcoat`
    ADD `parentWithCoatNeeded` BOOLEAN NOT NULL DEFAULT TRUE AFTER `releaseDate`,
    ADD `chanceBaseWithoutParent` FLOAT NOT NULL DEFAULT '0.0' AFTER `parentWithCoatNeeded`,
    ADD `chanceBaseWithOneParent` FLOAT NOT NULL DEFAULT '0.0' AFTER `chanceBaseWithoutParent`,
    ADD `chanceEventWithoutParent` FLOAT NOT NULL DEFAULT '0.0' AFTER `chanceBaseWithOneParent`,
    ADD `chanceEventWithOneParent` FLOAT NOT NULL DEFAULT '0.0' AFTER `chanceEventWithoutParent`;