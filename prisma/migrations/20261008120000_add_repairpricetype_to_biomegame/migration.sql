-- Add repairpricetype column to biomegame (default 1 = Zoodollar)
ALTER TABLE `biomegame` ADD COLUMN IF NOT EXISTS `repairpricetype` INT NOT NULL DEFAULT 1;
