-- =============================================================================
-- Chest Boost Import
-- Quelle: Zoo 2 Animal Park Wiki (Legendary, Retro, Epic Chest Boost Seiten)
-- Stand: Oktober 2026
--
-- Hinweis: Tiernamen werden über die englische Übersetzung (languageCode = 'en')
-- aus der animaltext-Tabelle nachgeschlagen. Einträge, deren Tiernahme nicht
-- exakt übereinstimmt, werden ohne Fehler übersprungen (INNER JOIN).
-- Bei Bedarf Tiernamen in der Quelltabelle prüfen oder SQL-Wert anpassen.
--
-- Sicher mehrfach ausführbar: bestehende Einträge bleiben unberührt
-- (vorausgesetzt, die Tabelle hat keine UNIQUE-Constraint auf diese Spalten).
-- Zur Sicherheit vor erneutem Import: TRUNCATE TABLE chestboost;
-- =============================================================================

-- =============================================================================
-- LEGENDARY CHEST (ab 2021)
-- =============================================================================

INSERT INTO chestboost (startDate, endDate, chestType, isEvent, animalId)
SELECT d.s, d.e, 'LEGENDARY', d.ev, a.id
FROM (
    SELECT '2021-04-03' AS s, '2021-05-27' AS e, 0 AS ev, 'Crested Porcupine'          AS n UNION ALL
    SELECT '2021-05-27', '2021-08-19', 0, 'African Civet'                                    UNION ALL
    SELECT '2021-08-19', '2021-11-11', 0, 'Clouded Leopard'                                  UNION ALL
    SELECT '2021-11-11', '2021-12-08', 0, 'Giant Anteater'                                   UNION ALL
    SELECT '2021-12-08', '2021-12-09', 1, 'Ringtail'                                         UNION ALL
    SELECT '2021-12-09', '2021-12-10', 1, 'Warthog'                                          UNION ALL
    SELECT '2021-12-10', '2021-12-11', 1, 'Kinkajou'                                         UNION ALL
    SELECT '2021-12-11', '2021-12-12', 1, 'Eastern Grass Owl'                                UNION ALL
    SELECT '2021-12-12', '2021-12-13', 1, 'Canadian Lynx'                                    UNION ALL
    SELECT '2021-12-13', '2021-12-14', 1, 'Kakapo'                                           UNION ALL
    -- 2021/2022
    SELECT '2021-12-14', '2022-02-03', 0, 'Giant Anteater'                                   UNION ALL
    -- 2022
    SELECT '2022-02-03', '2022-03-22', 0, 'Cheetah'                                          UNION ALL
    SELECT '2022-03-22', '2022-03-23', 0, 'Clouded Leopard'                                  UNION ALL
    SELECT '2022-03-23', '2022-04-28', 0, 'Cheetah'                                          UNION ALL
    SELECT '2022-04-28', '2022-07-21', 0, 'Yak'                                              UNION ALL
    SELECT '2022-07-21', '2022-10-13', 0, 'Cougar'                                           UNION ALL
    SELECT '2022-10-13', '2022-11-24', 0, 'Narwhal'                                          UNION ALL
    -- 2022/2023
    SELECT '2022-11-24', '2023-01-19', 0, 'Mexican Tree Porcupine'                           UNION ALL
    -- 2023
    SELECT '2023-01-19', '2023-03-16', 0, 'African Golden Cat'                               UNION ALL
    SELECT '2023-03-16', '2023-05-11', 0, 'Binturong'                                        UNION ALL
    SELECT '2023-05-11', '2023-07-06', 0, 'Silvery Greater Galago'                           UNION ALL
    SELECT '2023-07-06', '2023-08-31', 0, 'Yakutian Horse'                                   UNION ALL
    SELECT '2023-08-31', '2023-10-26', 0, 'Nile Monitor'                                     UNION ALL
    SELECT '2023-10-26', '2023-12-21', 0, 'Hammerhead Shark'                                 UNION ALL
    -- 2023/2024
    SELECT '2023-12-21', '2024-02-15', 0, 'Gerenuk'                                          UNION ALL
    -- 2024
    SELECT '2024-02-15', '2024-04-11', 0, 'Guereza'                                          UNION ALL
    SELECT '2024-04-11', '2024-06-06', 0, 'Andean Condor'                                    UNION ALL
    SELECT '2024-06-06', '2024-08-01', 0, 'Commerson\'s Dolphin'                             UNION ALL
    SELECT '2024-08-01', '2024-09-05', 0, 'Grévy\'s Zebra'                                   UNION ALL
    SELECT '2024-09-05', '2024-09-06', 1, 'Silvery Greater Galago'                           UNION ALL
    SELECT '2024-09-06', '2024-09-07', 1, 'Binturong'                                        UNION ALL
    SELECT '2024-09-07', '2024-09-08', 1, 'Kinkajou'                                         UNION ALL
    SELECT '2024-09-08', '2024-09-09', 1, 'Ringtail'                                         UNION ALL
    SELECT '2024-09-09', '2024-09-26', 0, 'Grévy\'s Zebra'                                   UNION ALL
    SELECT '2024-09-26', '2024-11-21', 0, 'Sumatran Tiger'                                   UNION ALL
    -- 2024/2025
    SELECT '2024-11-21', '2025-01-16', 0, 'Masai Giraffe'                                    UNION ALL
    -- 2025
    SELECT '2025-01-16', '2025-03-13', 0, 'Sawfish'                                          UNION ALL
    SELECT '2025-03-13', '2025-05-08', 0, 'Spectacled Bear'                                  UNION ALL
    SELECT '2025-05-08', '2025-05-22', 0, 'Angora Rabbit'                                    UNION ALL
    SELECT '2025-05-22', '2025-05-23', 1, 'Kakapo'                                           UNION ALL
    SELECT '2025-05-23', '2025-05-24', 1, 'Canadian Lynx'                                    UNION ALL
    SELECT '2025-05-24', '2025-05-25', 1, 'Clouded Leopard'                                  UNION ALL
    SELECT '2025-05-25', '2025-05-26', 1, 'Eastern Grass Owl'                                UNION ALL
    SELECT '2025-05-26', '2025-07-03', 0, 'Angora Rabbit'                                    UNION ALL
    SELECT '2025-07-03', '2025-08-18', 0, 'Humpback Whale'                                   UNION ALL
    SELECT '2025-08-18', '2025-08-19', 1, 'Sumatran Tiger'                                   UNION ALL
    SELECT '2025-08-19', '2025-08-20', 1, 'Warthog'                                          UNION ALL
    SELECT '2025-08-20', '2025-08-21', 1, 'Cougar'                                           UNION ALL
    SELECT '2025-08-21', '2025-08-22', 1, 'African Civet'                                    UNION ALL
    SELECT '2025-08-22', '2025-08-28', 0, 'Humpback Whale'                                   UNION ALL
    SELECT '2025-08-28', '2025-10-23', 0, 'Sumatran Rhinoceros'                              UNION ALL
    SELECT '2025-10-23', '2025-12-18', 0, 'Western Lowland Gorilla'                          UNION ALL
    -- 2025/2026
    SELECT '2025-12-18', '2026-02-12', 0, 'Lady Amherst\'s Pheasant'                         UNION ALL
    -- 2026
    SELECT '2026-02-12', '2026-04-09', 0, 'Scarlet Ibis'                                     UNION ALL
    SELECT '2026-04-09', '2026-05-28', 0, 'Asian Elephant'                                   UNION ALL
    SELECT '2026-05-28', '2026-05-29', 1, 'Narwhal'                                          UNION ALL
    SELECT '2026-05-29', '2026-05-30', 1, 'Crested Porcupine'                                UNION ALL
    SELECT '2026-05-30', '2026-05-31', 1, 'Yak'                                              UNION ALL
    SELECT '2026-05-31', '2026-06-01', 1, 'Cheetah'                                          UNION ALL
    SELECT '2026-06-01', '2026-06-04', 0, 'Asian Elephant'                                   UNION ALL
    SELECT '2026-06-04', '2026-07-30', 0, 'Yacare Caiman'                                    UNION ALL
    SELECT '2026-07-30', '2026-09-24', 0, 'Gaur'                                             UNION ALL
    SELECT '2026-09-24', '2026-11-19', 0, 'Borneo Elephant'
) AS d
INNER JOIN animaltext t ON t.animalName = d.n AND t.languageCode = 'en'
INNER JOIN animal a ON a.id = t.animalId;

-- =============================================================================
-- RETRO CHEST (ab 2019)
-- =============================================================================

INSERT INTO chestboost (startDate, endDate, chestType, isEvent, animalId)
SELECT d.s, d.e, 'RETRO', d.ev, a.id
FROM (
    -- 2019/2020
    SELECT '2019-09-23' AS s, '2020-01-09' AS e, 0 AS ev, 'Leopard'                    AS n UNION ALL
    -- 2020
    SELECT '2020-01-09', '2020-03-12', 0, 'Golden Pheasant'                                  UNION ALL
    SELECT '2020-03-12', '2020-05-14', 0, 'Raccoon'                                          UNION ALL
    SELECT '2020-05-14', '2020-07-16', 0, 'Fennec Fox'                                       UNION ALL
    SELECT '2020-07-16', '2020-09-17', 0, 'Sulphur-Crested Cockatoo'                         UNION ALL
    SELECT '2020-09-17', '2020-10-20', 0, 'Red Ruffed Lemur'                                 UNION ALL
    SELECT '2020-10-20', '2020-10-21', 1, 'Sloth'                                            UNION ALL
    SELECT '2020-10-21', '2020-11-19', 1, 'Red Ruffed Lemur'                                 UNION ALL
    -- 2020/2021
    SELECT '2020-11-19', '2021-01-21', 0, 'Flying Fox'                                       UNION ALL
    -- 2021
    SELECT '2021-01-21', '2021-03-25', 0, 'Swan'                                             UNION ALL
    SELECT '2021-03-25', '2021-04-16', 0, 'African Wild Dog'                                 UNION ALL
    SELECT '2021-04-16', '2021-04-17', 1, 'Flying Fox'                                       UNION ALL
    SELECT '2021-04-17', '2021-05-27', 1, 'African Wild Dog'                                 UNION ALL
    SELECT '2021-05-27', '2021-07-29', 0, 'Northern Red-Billed Hornbill'                     UNION ALL
    SELECT '2021-07-29', '2021-09-30', 0, 'Bongo Antelope'                                   UNION ALL
    SELECT '2021-09-30', '2021-10-20', 0, 'Goodfellow\'s Tree Kangaroo'                      UNION ALL
    SELECT '2021-10-20', '2021-10-21', 1, 'Sloth'                                            UNION ALL
    SELECT '2021-10-21', '2021-12-02', 0, 'Goodfellow\'s Tree Kangaroo'                      UNION ALL
    SELECT '2021-12-02', '2021-12-08', 0, 'Wolverine'                                        UNION ALL
    SELECT '2021-12-08', '2021-12-09', 1, 'Red Ruffed Lemur'                                 UNION ALL
    SELECT '2021-12-09', '2021-12-10', 1, 'Bongo Antelope'                                   UNION ALL
    SELECT '2021-12-10', '2021-12-11', 1, 'Swan'                                             UNION ALL
    SELECT '2021-12-11', '2021-12-12', 1, 'Golden Pheasant'                                  UNION ALL
    SELECT '2021-12-12', '2021-12-13', 1, 'Fennec Fox'                                       UNION ALL
    SELECT '2021-12-13', '2021-12-14', 1, 'African Wild Dog'                                 UNION ALL
    -- 2021/2022
    SELECT '2021-12-14', '2022-01-05', 0, 'Wolverine'                                        UNION ALL
    SELECT '2022-01-05', '2022-01-06', 1, 'Sulphur-Crested Cockatoo'                         UNION ALL
    SELECT '2022-01-06', '2022-02-03', 0, 'Wolverine'                                        UNION ALL
    -- 2022
    SELECT '2022-02-03', '2022-03-11', 0, 'Golden Takin'                                     UNION ALL
    SELECT '2022-03-11', '2022-03-12', 1, 'Northern Red-Billed Hornbill'                     UNION ALL
    SELECT '2022-03-12', '2022-03-22', 0, 'Golden Takin'                                     UNION ALL
    SELECT '2022-03-22', '2022-03-23', 1, 'Leopard'                                          UNION ALL
    SELECT '2022-03-23', '2022-04-07', 0, 'Golden Takin'                                     UNION ALL
    SELECT '2022-04-07', '2022-04-17', 0, 'Orangutan'                                        UNION ALL
    SELECT '2022-04-17', '2022-04-18', 1, 'Flying Fox'                                       UNION ALL
    SELECT '2022-04-18', '2022-04-21', 0, 'Orangutan'                                        UNION ALL
    SELECT '2022-04-21', '2022-04-22', 0, 'Alpine Ibex'                                      UNION ALL
    SELECT '2022-04-22', '2022-06-09', 0, 'Orangutan'                                        UNION ALL
    SELECT '2022-06-09', '2022-07-21', 0, 'Spotted Hyena'                                    UNION ALL
    SELECT '2022-07-21', '2022-07-22', 0, 'Tundra Wolf'                                      UNION ALL
    SELECT '2022-07-22', '2022-07-28', 0, 'Spotted Hyena'                                    UNION ALL
    SELECT '2022-07-28', '2022-07-29', 1, 'Tundra Wolf'                                      UNION ALL
    SELECT '2022-07-29', '2022-08-11', 0, 'Spotted Hyena'                                    UNION ALL
    SELECT '2022-08-11', '2022-09-16', 0, 'Stoat'                                            UNION ALL
    SELECT '2022-09-16', '2022-09-18', 1, 'Raccoon'                                          UNION ALL
    SELECT '2022-09-18', '2022-10-13', 0, 'Stoat'                                            UNION ALL
    SELECT '2022-10-13', '2022-11-24', 0, 'Caracal'                                          UNION ALL
    SELECT '2022-11-24', '2022-12-22', 0, 'Tamandua'                                         UNION ALL
    -- 2022/2023
    SELECT '2022-12-22', '2023-01-19', 0, 'Bat-Eared Fox'                                    UNION ALL
    -- 2023
    SELECT '2023-01-19', '2023-02-16', 0, 'Common Wombat'                                    UNION ALL
    SELECT '2023-02-16', '2023-03-16', 0, 'Patas Monkey'                                     UNION ALL
    SELECT '2023-03-16', '2023-04-13', 0, 'Musk Ox'                                          UNION ALL
    SELECT '2023-04-13', '2023-05-11', 0, 'Brushtail Possum'                                 UNION ALL
    SELECT '2023-05-11', '2023-06-08', 0, 'Oryx'                                             UNION ALL
    SELECT '2023-06-08', '2023-07-06', 0, 'Beluga Whale'                                     UNION ALL
    SELECT '2023-07-06', '2023-08-03', 0, 'Panamanian White-Faced Capuchin'                  UNION ALL
    SELECT '2023-08-03', '2023-08-31', 0, 'Impala'                                           UNION ALL
    SELECT '2023-08-31', '2023-09-28', 0, 'Bearded Vulture'                                  UNION ALL
    SELECT '2023-09-28', '2023-10-26', 0, 'Shoebill'                                         UNION ALL
    SELECT '2023-10-26', '2023-11-23', 0, 'Musk Deer'                                        UNION ALL
    SELECT '2023-11-23', '2023-12-21', 0, 'Aardwolf'                                         UNION ALL
    -- 2023/2024
    SELECT '2023-12-21', '2024-01-18', 0, 'Bush Dog'                                         UNION ALL
    -- 2024
    SELECT '2024-01-18', '2024-02-15', 0, 'Wapiti'                                           UNION ALL
    SELECT '2024-02-15', '2024-03-14', 0, 'Tiger Shark'                                      UNION ALL
    SELECT '2024-03-14', '2024-04-11', 0, 'De Brazza\'s Monkey'                              UNION ALL
    SELECT '2024-04-11', '2024-05-09', 0, 'Banded Mongoose'                                  UNION ALL
    SELECT '2024-05-09', '2024-06-06', 0, 'Dhole'                                            UNION ALL
    SELECT '2024-06-06', '2024-07-04', 0, 'Sloth Bear'                                       UNION ALL
    SELECT '2024-07-04', '2024-08-01', 0, 'Japanese Serow'                                   UNION ALL
    SELECT '2024-08-01', '2024-08-29', 0, 'Whiptail Wallaby'                                 UNION ALL
    SELECT '2024-08-29', '2024-09-05', 0, 'Emu'                                              UNION ALL
    SELECT '2024-09-05', '2024-09-06', 1, 'Tundra Wolf'                                      UNION ALL
    SELECT '2024-09-06', '2024-09-07', 1, 'Alpine Ibex'                                      UNION ALL
    SELECT '2024-09-07', '2024-09-08', 1, 'Tamandua'                                         UNION ALL
    SELECT '2024-09-08', '2024-09-09', 1, 'Bat-Eared Fox'                                    UNION ALL
    SELECT '2024-09-09', '2024-09-26', 0, 'Emu'                                              UNION ALL
    SELECT '2024-09-26', '2024-10-24', 0, 'Golden Snub-Nosed Monkey'                         UNION ALL
    SELECT '2024-10-24', '2024-11-21', 0, 'American Hog-Nosed Skunk'                         UNION ALL
    SELECT '2024-11-21', '2024-12-19', 0, 'Puffin'                                           UNION ALL
    -- 2024/2025
    SELECT '2024-12-19', '2025-01-16', 0, 'Tasmanian Devil'                                  UNION ALL
    -- 2025
    SELECT '2025-01-16', '2025-02-13', 0, 'Virginia Opossum'                                 UNION ALL
    SELECT '2025-02-13', '2025-03-13', 0, 'Red-Crowned Crane'                                UNION ALL
    SELECT '2025-03-13', '2025-04-10', 0, 'Blackbuck'                                        UNION ALL
    SELECT '2025-04-10', '2025-05-08', 0, 'Canadian Porcupine'                               UNION ALL
    SELECT '2025-05-08', '2025-05-22', 0, 'Hawksbill Sea Turtle'                             UNION ALL
    SELECT '2025-05-22', '2025-05-23', 1, 'Wolverine'                                        UNION ALL
    SELECT '2025-05-23', '2025-05-24', 1, 'Sloth'                                            UNION ALL
    SELECT '2025-05-24', '2025-05-25', 1, 'Patas Monkey'                                     UNION ALL
    SELECT '2025-05-25', '2025-05-26', 1, 'Aardwolf'                                         UNION ALL
    SELECT '2025-05-26', '2025-06-05', 0, 'Hawksbill Sea Turtle'                             UNION ALL
    SELECT '2025-06-05', '2025-07-03', 0, 'Bearded Pig'                                      UNION ALL
    SELECT '2025-07-03', '2025-07-31', 0, 'Brown Hyena'                                      UNION ALL
    SELECT '2025-07-31', '2025-08-18', 0, 'Black-Bearded Saki'                               UNION ALL
    SELECT '2025-08-18', '2025-08-19', 1, 'Flying Fox'                                       UNION ALL
    SELECT '2025-08-19', '2025-08-20', 1, 'Orangutan'                                        UNION ALL
    SELECT '2025-08-20', '2025-08-21', 1, 'Bongo Antelope'                                   UNION ALL
    SELECT '2025-08-21', '2025-08-22', 1, 'Leopard'                                          UNION ALL
    SELECT '2025-08-22', '2025-08-28', 0, 'Black-Bearded Saki'                               UNION ALL
    SELECT '2025-08-28', '2025-09-25', 0, 'Indian Rhinoceros'                                UNION ALL
    SELECT '2025-09-25', '2025-10-10', 0, 'Ground Pangolin'                                  UNION ALL
    SELECT '2025-10-10', '2025-11-20', 0, 'Giant Eland'                                      UNION ALL
    SELECT '2025-11-20', '2025-12-18', 0, 'Alpine Marmot'                                    UNION ALL
    -- 2025/2026
    SELECT '2025-12-18', '2026-01-15', 0, 'Siberian Tiger'                                   UNION ALL
    -- 2026
    SELECT '2026-01-15', '2026-02-12', 0, 'Indian Star Tortoise'                             UNION ALL
    SELECT '2026-02-12', '2026-03-12', 0, 'Common Genet'                                     UNION ALL
    SELECT '2026-03-12', '2026-04-09', 0, 'Ethiopian Wolf'                                   UNION ALL
    SELECT '2026-04-09', '2026-05-07', 0, 'Ghost Bat'                                        UNION ALL
    SELECT '2026-05-07', '2026-05-28', 0, 'Short-Eared Zorro'                                UNION ALL
    SELECT '2026-05-28', '2026-05-29', 1, 'African Wild Dog'                                 UNION ALL
    SELECT '2026-05-29', '2026-05-30', 1, 'Red Ruffed Lemur'                                 UNION ALL
    SELECT '2026-05-30', '2026-05-31', 1, 'Fennec Fox'                                       UNION ALL
    SELECT '2026-05-31', '2026-06-01', 1, 'Tiger Shark'                                      UNION ALL
    SELECT '2026-06-01', '2026-06-04', 0, 'Short-Eared Zorro'                                UNION ALL
    SELECT '2026-06-04', '2026-07-02', 0, 'Black-Footed Cat'                                 UNION ALL
    SELECT '2026-07-02', '2026-07-30', 0, 'Black Rhinoceros'                                 UNION ALL
    SELECT '2026-07-30', '2026-08-27', 0, 'European Wildcat'                                 UNION ALL
    SELECT '2026-08-27', '2026-09-24', 0, 'Galápagos Pink Land Iguana'                       UNION ALL
    SELECT '2026-09-24', '2026-10-22', 0, 'Red-Necked Pademelon'                             UNION ALL
    SELECT '2026-10-22', '2026-11-19', 0, 'Gharial'
) AS d
INNER JOIN animaltext t ON t.animalName = d.n AND t.languageCode = 'en'
INNER JOIN animal a ON a.id = t.animalId;

-- =============================================================================
-- EPIC CHEST (ab 2018)
-- =============================================================================

INSERT INTO chestboost (startDate, endDate, chestType, isEvent, animalId)
SELECT d.s, d.e, 'EPIC', d.ev, a.id
FROM (
    -- 2018/2019
    SELECT '2018-11-30' AS s, '2019-03-15' AS e, 0 AS ev, 'Lar Gibbon'                 AS n UNION ALL
    -- 2019
    SELECT '2019-03-15', '2019-05-08', 0, 'Bengal Tiger'                                     UNION ALL
    SELECT '2019-05-08', '2019-06-21', 0, 'Mountain Gorilla'                                 UNION ALL
    SELECT '2019-06-21', '2019-07-29', 0, 'Lar Gibbon'                                       UNION ALL
    SELECT '2019-07-29', '2019-09-24', 0, 'Bengal Tiger'                                     UNION ALL
    SELECT '2019-09-24', '2019-11-05', 0, 'Mountain Gorilla'                                 UNION ALL
    -- 2019/2020
    SELECT '2019-11-05', '2020-01-09', 0, 'Lar Gibbon'                                       UNION ALL
    -- 2020
    SELECT '2020-01-09', '2020-02-20', 0, 'Bengal Tiger'                                     UNION ALL
    SELECT '2020-02-20', '2020-04-02', 0, 'Mountain Gorilla'                                 UNION ALL
    SELECT '2020-04-02', '2020-05-14', 0, 'Lar Gibbon'                                       UNION ALL
    SELECT '2020-05-14', '2020-06-25', 0, 'Bengal Tiger'                                     UNION ALL
    SELECT '2020-06-25', '2020-08-06', 0, 'Mountain Gorilla'                                 UNION ALL
    SELECT '2020-08-06', '2020-09-17', 0, 'Lar Gibbon'                                       UNION ALL
    SELECT '2020-09-17', '2020-10-29', 0, 'Bengal Tiger'                                     UNION ALL
    SELECT '2020-10-29', '2020-12-10', 0, 'King Eider'                                       UNION ALL
    SELECT '2020-12-10', '2021-01-21', 0, 'Mountain Gorilla'                                 UNION ALL
    -- 2021
    SELECT '2021-01-21', '2021-03-04', 0, 'Lar Gibbon'                                       UNION ALL
    SELECT '2021-03-04', '2021-04-15', 0, 'Pronghorn'                                        UNION ALL
    SELECT '2021-04-15', '2021-05-27', 0, 'Red River Hog'                                    UNION ALL
    SELECT '2021-05-27', '2021-07-07', 0, 'Bengal Tiger'                                     UNION ALL
    SELECT '2021-07-07', '2021-08-19', 0, 'King Eider'                                       UNION ALL
    SELECT '2021-08-19', '2021-09-30', 0, 'Mountain Gorilla'                                 UNION ALL
    SELECT '2021-09-30', '2021-11-11', 0, 'Pronghorn'                                        UNION ALL
    SELECT '2021-11-11', '2021-12-23', 0, 'Lar Gibbon'                                       UNION ALL
    -- 2021/2022
    SELECT '2021-12-23', '2022-02-03', 0, 'Red River Hog'                                    UNION ALL
    -- 2022
    SELECT '2022-02-03', '2022-03-17', 0, 'Bengal Tiger'                                     UNION ALL
    SELECT '2022-03-17', '2022-04-28', 0, 'Maikong'                                          UNION ALL
    SELECT '2022-04-28', '2022-06-09', 0, 'King Eider'                                       UNION ALL
    SELECT '2022-06-09', '2022-07-21', 0, 'Mountain Gorilla'                                 UNION ALL
    SELECT '2022-07-21', '2022-09-01', 0, 'Leopard Seal'                                     UNION ALL
    SELECT '2022-09-01', '2022-10-13', 0, 'Pronghorn'                                        UNION ALL
    SELECT '2022-10-13', '2022-11-24', 0, 'Lar Gibbon'                                       UNION ALL
    -- 2022/2023
    SELECT '2022-11-24', '2023-01-05', 0, 'Red River Hog'                                    UNION ALL
    -- 2023
    SELECT '2023-01-05', '2023-02-16', 0, 'Sable'                                            UNION ALL
    SELECT '2023-02-16', '2023-03-30', 0, 'Maikong'                                          UNION ALL
    SELECT '2023-03-30', '2023-05-11', 0, 'King Eider'                                       UNION ALL
    SELECT '2023-05-11', '2023-06-22', 0, 'Leopard Seal'                                     UNION ALL
    SELECT '2023-06-22', '2023-08-03', 0, 'Grey-Crowned Crane'                               UNION ALL
    SELECT '2023-08-03', '2023-09-14', 0, 'Pronghorn'                                        UNION ALL
    SELECT '2023-09-14', '2023-10-26', 0, 'Red River Hog'                                    UNION ALL
    SELECT '2023-10-26', '2023-12-07', 0, 'Sable'                                            UNION ALL
    -- 2023/2024
    SELECT '2023-12-07', '2024-01-18', 0, 'Tamaraw'                                          UNION ALL
    -- 2024
    SELECT '2024-01-18', '2024-02-29', 0, 'Maikong'                                          UNION ALL
    SELECT '2024-02-29', '2024-04-11', 0, 'King Eider'                                       UNION ALL
    SELECT '2024-04-11', '2024-05-23', 0, 'Leopard Seal'                                     UNION ALL
    SELECT '2024-05-23', '2024-07-04', 0, 'Blue-Eyed Black Lemur'                            UNION ALL
    SELECT '2024-07-04', '2024-08-15', 0, 'Grey-Crowned Crane'                               UNION ALL
    SELECT '2024-08-15', '2024-09-05', 0, 'Pronghorn'                                        UNION ALL
    SELECT '2024-09-05', '2024-09-06', 1, 'Bengal Tiger'                                     UNION ALL
    SELECT '2024-09-06', '2024-09-07', 1, 'Sable'                                            UNION ALL
    SELECT '2024-09-07', '2024-09-08', 1, 'Mountain Gorilla'                                 UNION ALL
    SELECT '2024-09-08', '2024-09-09', 1, 'Tamaraw'                                          UNION ALL
    SELECT '2024-09-09', '2024-09-26', 0, 'Pronghorn'                                        UNION ALL
    SELECT '2024-09-26', '2024-11-07', 0, 'Red River Hog'                                    UNION ALL
    SELECT '2024-11-07', '2024-12-19', 0, 'White Pelican'                                    UNION ALL
    -- 2024/2025
    SELECT '2024-12-19', '2025-02-04', 0, 'Sable'                                            UNION ALL
    -- 2025
    SELECT '2025-02-04', '2025-03-13', 0, 'Tamaraw'                                          UNION ALL
    SELECT '2025-03-13', '2025-04-24', 0, 'Maikong'                                          UNION ALL
    SELECT '2025-04-24', '2025-05-22', 0, 'Argentine Black and White Tegu'                   UNION ALL
    SELECT '2025-05-22', '2025-05-23', 1, 'Lar Gibbon'                                       UNION ALL
    SELECT '2025-05-23', '2025-05-24', 1, 'Red River Hog'                                    UNION ALL
    SELECT '2025-05-24', '2025-05-25', 1, 'Tamaraw'                                          UNION ALL
    SELECT '2025-05-25', '2025-05-26', 1, 'Pronghorn'                                        UNION ALL
    SELECT '2025-05-26', '2025-06-05', 0, 'Argentine Black and White Tegu'                   UNION ALL
    SELECT '2025-06-05', '2025-07-17', 0, 'Leopard Seal'                                     UNION ALL
    SELECT '2025-07-17', '2025-08-18', 0, 'Blue-Eyed Black Lemur'                            UNION ALL
    SELECT '2025-08-18', '2025-08-19', 1, 'Lar Gibbon'                                       UNION ALL
    SELECT '2025-08-19', '2025-08-20', 1, 'Argentine Black and White Tegu'                   UNION ALL
    SELECT '2025-08-20', '2025-08-21', 1, 'Bengal Tiger'                                     UNION ALL
    SELECT '2025-08-21', '2025-08-22', 1, 'Mountain Gorilla'                                 UNION ALL
    SELECT '2025-08-22', '2025-08-28', 0, 'Blue-Eyed Black Lemur'                            UNION ALL
    SELECT '2025-08-28', '2025-10-09', 0, 'Grey-Crowned Crane'                               UNION ALL
    SELECT '2025-10-09', '2025-11-20', 0, 'Takahē'                                           UNION ALL
    -- 2025/2026
    SELECT '2025-11-20', '2026-01-01', 0, 'White Pelican'                                    UNION ALL
    -- 2026
    SELECT '2026-01-01', '2026-02-12', 0, 'Sable'                                            UNION ALL
    SELECT '2026-02-12', '2026-03-26', 0, 'Tamaraw'                                          UNION ALL
    SELECT '2026-03-26', '2026-05-07', 0, 'Siamang'                                          UNION ALL
    SELECT '2026-05-07', '2026-05-28', 0, 'Argentine Black and White Tegu'                   UNION ALL
    SELECT '2026-05-28', '2026-05-29', 1, 'King Eider'                                       UNION ALL
    SELECT '2026-05-29', '2026-05-30', 1, 'Pronghorn'                                        UNION ALL
    SELECT '2026-05-30', '2026-05-31', 1, 'Red River Hog'                                    UNION ALL
    SELECT '2026-05-31', '2026-06-01', 1, 'Lar Gibbon'                                       UNION ALL
    SELECT '2026-06-01', '2026-06-18', 0, 'Argentine Black and White Tegu'                   UNION ALL
    SELECT '2026-06-18', '2026-07-30', 0, 'Leopard Seal'                                     UNION ALL
    SELECT '2026-07-30', '2026-09-10', 0, 'Blue-Eyed Black Lemur'                            UNION ALL
    SELECT '2026-09-10', '2026-10-22', 0, 'Long-Tailed Duck'                                 UNION ALL
    SELECT '2026-10-22', '2026-12-03', 0, 'Grey-Crowned Crane'
) AS d
INNER JOIN animaltext t ON t.animalName = d.n AND t.languageCode = 'en'
INNER JOIN animal a ON a.id = t.animalId;

-- =============================================================================
-- Prüfabfrage: Wie viele Einträge wurden importiert?
-- =============================================================================
-- SELECT chestType, COUNT(*) AS anzahl FROM chestboost GROUP BY chestType;
