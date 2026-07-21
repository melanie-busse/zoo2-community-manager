-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 13. Jul 2026 um 19:42
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `zoo2-community-manager`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `origin`
--

CREATE TABLE `origin` (
  `id` int(11) NOT NULL,
  `wiki_icon:name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1. Fremdschlüsselprüfung temporär ausschalten
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Alle Daten löschen
DELETE FROM Origin;

-- 3. Den Auto-Increment-Zähler wieder auf 1 zurücksetzen
ALTER TABLE Origin AUTO_INCREMENT = 1;

-- 4. Fremdschlüsselprüfung wieder einschalten
SET FOREIGN_KEY_CHECKS = 1;

--
-- Daten für Tabelle `origin`
--

INSERT INTO `origin` (`id`, `wiki_icon:name`, `image`) VALUES
(1, 'Academy_Icon.png', 'academy.png'),
(2, 'Collections_Icon.png', 'collections.png'),
(3, '', 'zucht.png'),
(4, 'Event_Icon.png', 'event.png'),
(5, '', 'klubwettbewerb.png'),
(6, '', 'zucht.png'),
(7, 'VIP_Icon.png', 'vip.png'),
(8, 'Calendar_Icon.png', 'calender.png'),
(9, 'Premium_Animal_Icon.png', 'premium.png'),
(10, 'Shop_Icon.png', 'shop.png'),
(12, 'Friendship_Icon.png', 'friendship-chest.png'),
(13, 'Retro_Icon1.png', 'retro-chest.png'),
(14, 'Legendary_Icon1.png', 'legendary-chest.png'),
(15, 'Quest_Icon.png', 'quest.png'),
(16, 'Level_Up_Icon.png', 'level-up.png'),
(17, 'Epic_Icon_E.png', 'epic-chest.png'),
(18, 'Coin_Chest_Icon.png', 'rar-chest.png'),
(19, 'Top-Angebot', 'top.png'),
(20, 'Prize_Wheel_Icon.png', 'prize-wheel.png'),
(21, 'Ice_Cream_Icon.png', 'ice-cream.png'),
(22, 'Premium_Grayed_out_Icon.jpg', 'formerPremium.png'),
(23, 'VIP_Grayed_out_Icon.jpg', 'formerVIP.png'),
(24, 'Penguin_Icon.png', 'seasonspass.png'),
(25, 'CW_Icon.png', 'conservation-week.png'),
(26, 'Season_Pass_Bonus_Prize.jpg', 'seasonspass-bonus-prize.png'),
(27, 'Rescue_Center_Icon.jpg', 'rescue-center.png');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `origin`
--
ALTER TABLE `origin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `originindex` (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `origin`
--
ALTER TABLE `origin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
