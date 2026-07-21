-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 13. Jul 2026 um 21:49
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
-- Tabellenstruktur für Tabelle `origintext`
--

CREATE TABLE `origintext` (
  `id` int(11) NOT NULL,
  `originId` int(11) NOT NULL,
  `languageCode` varchar(5) NOT NULL,
  `originName` varchar(255) NOT NULL,
  `originDescription` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `origintext`
--

INSERT INTO `origintext` (`id`, `originId`, `languageCode`, `originName`, `originDescription`) VALUES
(1, 1, 'de', 'Akademie', 'Das Tier stammt aus dem Zoo-Akademie-Shop.'),
(2, 1, 'en', 'Academy', 'Animal is from the Zoo Academy Store.'),
(3, 1, 'da', 'Akademi', 'Dyret er fra Zoo Academy-butikken.'),
(4, 1, 'nl', 'Academie', 'Het dier is afkomstig uit de Zoo Academie Winkel.'),
(5, 1, 'fr', 'Académie', 'L\'animal provient de la boutique de l\'Académie du zoo.'),
(6, 1, 'es', 'Academia', 'El animal proviene de la tienda de la Academia del Zoo.'),
(7, 2, 'de', 'Sammelalbum', 'Das Tier kann aus Sammelalbums erhalten werden.'),
(8, 2, 'en', 'Collector\'s Album', 'Animal can be obtained from Collections.'),
(9, 2, 'da', 'Samlealbum', 'Dyret kan fås fra Samlinger.'),
(10, 2, 'nl', 'Verzamelalbum', 'Het dier kan worden verkregen uit Verzamelingen.'),
(11, 2, 'fr', 'Album de collection', 'L\'animal peut être obtenu dans les Collections.'),
(12, 2, 'es', 'Álbum de colección', 'El animal se puede obtener de las Colecciones.'),
(13, 3, 'de', 'Zuchtwochen', 'Das Tier kann aus Zuchtwochen erhalten werden.'),
(14, 3, 'en', 'Breeding Weeks', 'Animal can be obtained from breeding weeks.'),
(15, 3, 'da', 'Avlsuger', 'Dyret kan fås fra avlsuger.'),
(16, 3, 'nl', 'Kweekweken', 'Het dier kan worden verkregen uit kweekweken.'),
(17, 3, 'fr', 'Semaines d\'élevage', 'L\'animal peut être obtenu lors des semaines d\'élevage.'),
(18, 3, 'es', 'Semanas de cría', 'El animal se puede obtener de las semanas de cría.'),
(19, 4, 'de', 'Event', 'Das Tier war Teil eines Saisonevents.'),
(20, 4, 'en', 'Event', 'Animal was part of a Seasonal Event.'),
(21, 4, 'da', 'Event', 'Dyret var en del af et sæsonevent.'),
(22, 4, 'nl', 'Event', 'Het dier maakte deel uit van een Seizoensevenement.'),
(23, 4, 'fr', 'Événement', 'L\'animal faisait partie d\'un Événement saisonnier.'),
(24, 4, 'es', 'Evento', 'El animal formaba parte de un Evento de temporada.'),
(25, 5, 'de', 'Klubwettbewerb', 'Das Tier kann aus Klubwettbewerben erhalten werden.'),
(26, 5, 'en', 'Club Competition', 'Animal can be obtained from club competition.'),
(27, 5, 'da', 'Klubkonkurrence', 'Dyret kan fås fra klubkonkurrencer.'),
(28, 5, 'nl', 'Clubcompetitie', 'Het dier kan worden verkregen uit clubcompetities.'),
(29, 5, 'fr', 'Compétition de club', 'L\'animal peut être obtenu lors des compétitions de club.'),
(30, 5, 'es', 'Competición de club', 'El animal se puede obtener de las competiciones de club.'),
(31, 6, 'de', 'normale Zucht', 'Das Tier kann durch normale Zucht erhalten werden.'),
(32, 6, 'en', 'Regular Breeding', 'Animal can be obtained from regular breeding.'),
(33, 6, 'da', 'Normal avl', 'Dyret kan fås fra normal avl.'),
(34, 6, 'nl', 'Normale kweek', 'Het dier kan worden verkregen via normale kweek.'),
(35, 6, 'fr', 'Élevage normal', 'L\'animal peut être obtenu par élevage normal.'),
(36, 6, 'es', 'Cría normal', 'El animal se puede obtener mediante cría normal.'),
(37, 7, 'de', 'VIP-Tier', 'Das Tier war ein VIP-Bonustier und befindet sich möglicherweise noch auf der Kulanzhandelsliste.'),
(38, 7, 'en', 'VIP Animal', 'Animal was a VIP bonus animal and may still be on the Courtesy Trade List.'),
(39, 7, 'da', 'VIP-dyr', 'Dyret var et VIP-bonusdyr og er muligvis stadig på Høfligheds-handelslisten.'),
(40, 7, 'nl', 'VIP-dier', 'Het dier was een VIP-bonusdier en staat mogelijk nog op de Courtesy Trade List.'),
(41, 7, 'fr', 'Animal VIP', 'L\'animal était un animal bonus VIP et figure peut-être encore sur la liste de commerce de courtoisie.'),
(42, 7, 'es', 'Animal VIP', 'El animal era un animal de bonificación VIP y puede que todavía esté en la Lista de Comercio de Cortesía.'),
(43, 8, 'de', 'Kalender', 'Das Tier war eine Anmeldebelohnung aus dem monatlichen Belohnungskalender.'),
(44, 8, 'en', 'Calendar', 'Animal was a login reward from the monthly rewards calendar.'),
(45, 8, 'da', 'Kalender', 'Dyret var en login-belønning fra den månedlige belønningskalender.'),
(46, 8, 'nl', 'Kalender', 'Het dier was een inlogsbeloning van de maandelijkse beloningskalender.'),
(47, 8, 'fr', 'Calendrier', 'L\'animal était une récompense de connexion du calendrier de récompenses mensuel.'),
(48, 8, 'es', 'Calendario', 'El animal era una recompensa de inicio de sesión del calendario de recompensas mensual.'),
(49, 9, 'de', 'Premium-Tier', 'Das Tier war ein Premium-Bonustier und befindet sich möglicherweise noch auf der Kulanzhandelsliste.'),
(50, 9, 'en', 'Premium Animal', 'Animal was a Premium bonus animal and may still be on the Courtesy Trade List.'),
(51, 9, 'da', 'Premium-dyr', 'Dyret var et Premium-bonusdyr og er muligvis stadig på Høfligheds-handelslisten.'),
(52, 9, 'nl', 'Premium-dier', 'Het dier was een Premium-bonusdier en staat mogelijk nog op de Courtesy Trade List.'),
(53, 9, 'fr', 'Animal premium', 'L\'animal était un animal bonus Premium et figure peut-être encore sur la liste de commerce de courtoisie.'),
(54, 9, 'es', 'Animal premium', 'El animal era un animal de bonificación Premium y puede que todavía esté en la Lista de Comercio de Cortesía.'),
(55, 10, 'de', 'Shop', ' Das Tier wird im Tiershop oder Klubshop verkauft.'),
(56, 10, 'en', 'Shop', ' Animal is sold in the Animal Shop or Club Shop.'),
(57, 10, 'da', 'Butik', ' Dyret sælges i Dyrebutikken eller Klubbutikken.'),
(58, 10, 'nl', 'Shop', ' Het dier wordt verkocht in de Dierenwinkel of Clubwinkel.'),
(59, 10, 'fr', 'Boutique', ' L\'animal est vendu dans la Boutique animale ou la Boutique du club.'),
(60, 10, 'es', 'Tienda', ' El animal se vende en la Tienda de animales o en la Tienda del club.'),
(65, 12, 'de', 'Freundschaftstruhe', 'Das Tier befindet sich in Freundschaftstruhen.'),
(66, 12, 'en', 'Friendship Chest', 'Animal is in Friendship Chests.'),
(67, 12, 'da', 'Venskabsskrin', 'Dyret er i Venskabsskrin.'),
(68, 12, 'nl', 'Vriendschapskist', 'Het dier bevindt zich in Vriendschapskisten.'),
(69, 12, 'fr', 'Coffre d\'amitié', 'L\'animal se trouve dans des Coffres d\'amitié.'),
(70, 12, 'es', 'Cofre de amistad', 'El animal está en Cofres de amistad.'),
(71, 13, 'de', 'Retro Truhe', 'Das Tier befindet sich in Epischen Truhen (früher bekannt als Seltene Truhen).'),
(72, 13, 'en', 'Retro Chest', 'Animal is in Epic Chests (formerly known as Rare Chests).'),
(73, 13, 'da', 'Retro skrin', 'Dyret er i Episke skrin (tidligere kendt som Sjældne skrin).'),
(74, 13, 'nl', 'Retro kist', 'Het dier bevindt zich in Epische kisten (voorheen bekend als Zeldzame kisten).'),
(75, 13, 'fr', 'Coffre rétro', 'L\'animal se trouve dans des Coffres épiques (anciennement connus sous le nom de Coffres rares).'),
(76, 13, 'es', 'Cofre retro', 'El animal está en Cofres épicos (anteriormente conocidos como Cofres raros).'),
(77, 14, 'de', 'Legendäre Truhe', 'Das Tier befindet sich in Legendären Truhen.'),
(78, 14, 'en', 'Legendary Chest', 'Animal is in Legendary Chests.'),
(79, 14, 'da', 'Legendarisk skrin', 'Dyret er i Legendariske skrin.'),
(80, 14, 'nl', 'Legendarische kist', 'Het dier bevindt zich in Legendarische kisten.'),
(81, 14, 'fr', 'Coffre légendaire', 'L\'animal se trouve dans des Coffres légendaires.'),
(82, 14, 'es', 'Cofre legendario', 'El animal está en Cofres legendarios.'),
(83, 15, 'de', 'Quest', 'Das Tier ist eine Quest-Belohnung.'),
(84, 15, 'en', 'Quest', 'Animal is a Quest reward.'),
(85, 15, 'da', 'Quest', 'Dyret er en Quest-belønning.'),
(86, 15, 'nl', 'Quest', 'Het dier is een Quest-beloning.'),
(87, 15, 'fr', 'Quête', 'L\'animal est une récompense de Quête.'),
(88, 15, 'es', 'Misión', 'El animal es una recompensa de Misión.'),
(89, 16, 'de', 'Level Up', 'Das Tier ist eine Level-Up-Belohnung.'),
(90, 16, 'en', 'Level Up', 'Animal is a Level Up reward.'),
(91, 16, 'da', 'Level op', 'Dyret er en Level op-belønning.'),
(92, 16, 'nl', 'Level Up', 'Het dier is een Level Up-beloning.'),
(93, 16, 'fr', 'Monter de niveau', 'L\'animal est une récompense de Montée de niveau.'),
(94, 16, 'es', 'Subir de nivel', 'El animal es una recompensa por Subir de nivel.'),
(95, 17, 'de', 'Epische Truhe', 'Das Tier befindet sich in Epischen Truhen (früher bekannt als Seltene Truhen).'),
(96, 17, 'en', 'Epic Chest', 'Animal is in Epic Chests (formerly known as Rare Chests).'),
(97, 17, 'da', 'Episk skrin', 'Dyret er i Episke skrin (tidligere kendt som Sjældne skrin).'),
(98, 17, 'nl', 'Epische kist', 'Het dier bevindt zich in Epische kisten (voorheen bekend als Zeldzame kisten).'),
(99, 17, 'fr', 'Coffre épique', 'L\'animal se trouve dans des Coffres épiques (anciennement connus sous le nom de Coffres rares).'),
(100, 17, 'es', 'Cofre épico', 'El animal está en Cofres épicos (anteriormente conocidos como Cofres raros).'),
(101, 18, 'de', 'Seltene Truhe', 'Das Tier kann aus Seltenen Truhen erhalten werden.'),
(102, 18, 'en', 'Rare Chest', 'Animal can be obtained from rare chests.'),
(103, 18, 'da', 'Sjælden skrin', 'Dyret kan fås fra sjældne skrin.'),
(104, 18, 'nl', 'Zeldzame kist', 'Het dier kan worden verkregen uit zeldzame kisten.'),
(105, 18, 'fr', 'Coffre rare', 'L\'animal peut être obtenu dans des coffres rares.'),
(106, 18, 'es', 'Cofre raro', 'El animal se puede obtener de cofres raros.'),
(107, 19, 'de', 'Top-Angebot', 'Das Tier kann aus Top-Angeboten erhalten werden.'),
(108, 19, 'en', 'Top Offer', 'Animal can be obtained from top offers.'),
(109, 19, 'da', 'Topilbud', 'Dyret kan fås fra topilbud.'),
(110, 19, 'nl', 'Toptaanbod', 'Het dier kan worden verkregen via topacties.'),
(111, 19, 'fr', 'Offre spéciale', 'L\'animal peut être obtenu dans les offres spéciales.'),
(112, 19, 'es', 'Oferta especial', 'El animal se puede obtener de las ofertas especiales.'),
(113, 20, 'de', 'Glücksrad', 'Das Tier befindet sich im Glücksrad.'),
(114, 20, 'en', 'Wheel of Fortune', 'Animal is in the Prize Wheel.'),
(115, 20, 'da', 'Lykkehjul', 'Dyret er i Lykkehjulet.'),
(116, 20, 'nl', 'Geluksrad', 'Het dier bevindt zich in het Geluksrad.'),
(117, 20, 'fr', 'Roue de la fortune', 'L\'animal se trouve dans la Roue de la fortune.'),
(118, 20, 'es', 'Ruleta de la suerte', 'El animal está en la Ruleta de la suerte.'),
(119, 21, 'de', 'Eismann', 'Das Tier wird vom Eismann verkauft.'),
(120, 21, 'en', 'Ice Cream Man', 'Animal is sold by the Ice Cream Vendor.'),
(121, 21, 'da', 'Ismand', 'Dyret sælges af Ismanden.'),
(122, 21, 'nl', 'IJsverkoper', 'Het dier wordt verkocht door de IJsverkoper.'),
(123, 21, 'fr', 'Marchand de glaces', 'L\'animal est vendu par le Marchand de glaces.'),
(124, 21, 'es', 'Heladero', 'El animal es vendido por el Heladero.'),
(125, 22, 'de', 'Ehemaliges Premium-Tier', 'Das Tier war ein ehemaliges Premium-Bonustier, steht aber nicht mehr auf der Kulanzhandelsliste.'),
(126, 22, 'en', 'FormerPremium', 'Animal was a former Premium bonus animal but is no longer on the Courtesy Trade List.'),
(127, 22, 'da', 'Tidligere Premium-dyr', 'Dyret var et tidligere Premium-bonusdyr, men er ikke længere på Høfligheds-handelslisten.'),
(128, 22, 'nl', 'Voormalig Premium-dier', 'Het dier was een voormalig Premium-bonusdier, maar staat niet meer op de Courtesy Trade List.'),
(129, 22, 'fr', 'Ancien animal premium', 'L\'animal était un ancien animal bonus Premium, mais ne figure plus sur la liste de commerce de courtoisie.'),
(130, 22, 'es', 'Antiguo animal premium', 'El animal era un antiguo animal de bonificación Premium, pero ya no está en la Lista de Comercio de Cortesía.'),
(131, 23, 'de', 'Ehemaliges VIP-Tier', 'Das Tier war ein ehemaliges VIP-Bonustier, steht aber nicht mehr auf der Kulanzhandelsliste.'),
(132, 23, 'en', 'FormerVIP', 'Animal was a former VIP bonus animal but is no longer on the Courtesy Trade List.'),
(133, 23, 'da', 'Tidligere VIP-dyr', 'Dyret var et tidligere VIP-bonusdyr, men er ikke længere på Høfligheds-handelslisten.'),
(134, 23, 'nl', 'Voormalig VIP-dier', 'Het dier was een voormalig VIP-bonusdier, maar staat niet meer op de Courtesy Trade List.'),
(135, 23, 'fr', 'Ancien animal VIP', 'L\'animal était un ancien animal bonus VIP, mais ne figure plus sur la liste de commerce de courtoisie.'),
(136, 23, 'es', 'Antiguo animal VIP', 'El animal era un antiguo animal de bonificación VIP, pero ya no está en la Lista de Comercio de Cortesía.'),
(137, 24, 'de', 'Saisonpass', 'Diese Tiere sind über das Rettungszentrum erhältlich.'),
(138, 24, 'en', 'Season Pass', ' These animals are available from the Rescue Center.'),
(139, 24, 'da', 'Sæsonpas', 'Disse dyr er tilgængelige fra Redningscentret.'),
(140, 24, 'nl', 'Seizoenspas', 'Deze dieren zijn beschikbaar via het Reddingscentrum.'),
(141, 24, 'fr', 'Pass saisonnier', 'Ces animaux sont disponibles depuis le Centre de sauvetage.'),
(142, 24, 'es', 'Pase de temporada', 'Estos animales están disponibles en el Centro de rescate.'),
(143, 25, 'de', 'Artenschutzwoche', 'Diese Tiere sind über die Artenschutzwoche erhältlich.'),
(144, 25, 'en', 'Conservation week', 'These animals are available from the Conservation Week.'),
(145, 25, 'da', 'Bevarelsesuge', 'Disse dyr er tilgængelige fra Bevarelsesugen.'),
(146, 25, 'nl', 'Conservatieweek', 'Deze dieren zijn beschikbaar via de Conservatieweek.'),
(147, 25, 'fr', 'Semaine de conservation', 'Ces animaux sont disponibles depuis la Semaine de conservation.'),
(148, 25, 'es', 'Semana de conservación', 'Estos animales están disponibles en la Semana de conservación.'),
(149, 26, 'de', 'Saisonpass-Bonuspreis', 'Diese Tiere sind als Puzzlestück aus den Bonuslevel des Saisonpasses erhältlich.'),
(150, 26, 'en', 'Season Pass Bonus Prize', 'These animals are available as a puzzle piece from the Season Pass bonus levels.'),
(151, 26, 'da', 'Sæsonpas bonuspræmie', 'Disse dyr er tilgængelige som puslespilsbrik fra Sæsonpassets bonusniveauer.'),
(152, 26, 'nl', 'Seizoenspas bonusprijs', 'Deze dieren zijn beschikbaar als puzzelstuk van de bonusniveaus van de Seizoenspas.'),
(153, 26, 'fr', 'Prix bonus du pass saisonnier', 'Ces animaux sont disponibles sous forme de pièce de puzzle dans les niveaux bonus du pass saisonnier.'),
(154, 26, 'es', 'Premio bonus del pase de temporada', 'Estos animales están disponibles como pieza de puzle en los niveles de bonificación del Pase de temporada.'),
(155, 27, 'de', 'Rettungszentrum', 'Diese Tiere sind über das Rettungszentrum erhältlich.'),
(156, 27, 'en', 'Rescue Center', 'These animals are available from the Rescue Center.'),
(157, 27, 'da', 'Redningscenter', 'Disse dyr er tilgængelige fra Redningscentret.'),
(158, 27, 'nl', 'Reddingscentrum', 'Deze dieren zijn beschikbaar via het Reddingscentrum.'),
(159, 27, 'fr', 'Centre de sauvetage', 'Ces animaux sont disponibles depuis le Centre de sauvetage.'),
(160, 27, 'es', 'Centro de rescate', 'Estos animales están disponibles en el Centro de rescate.');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `origintext`
--
ALTER TABLE `origintext`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `originText_originId_languageCode_key` (`originId`,`languageCode`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `origintext`
--
ALTER TABLE `origintext`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `origintext`
--
ALTER TABLE `origintext`
  ADD CONSTRAINT `originText_originId_fkey` FOREIGN KEY (`originId`) REFERENCES `origin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
