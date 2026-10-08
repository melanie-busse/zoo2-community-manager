import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Texts = { en: string; de: string; es: string; da: string; fr: string; nl: string };

// pricetype: 1 = Coins, 2 = Diamonds
// buildTime: minutes (null = initial build, no upgrade timer)

// ─── SHELTER LEVELS ───────────────────────────────────────────────────────────
const shelterData: Record<
  string,
  { level: number; cost: number; pricetype: number; buildTime: number | null; unlockLevel: number | null }[]
> = {
  grassland:    [
    { level: 0, cost:  6000, pricetype: 1, buildTime: null, unlockLevel: null },
    { level: 1, cost:  3000, pricetype: 1, buildTime:  120, unlockLevel: 14 },
    { level: 2, cost:  6000, pricetype: 1, buildTime:  300, unlockLevel: 15 },
    { level: 3, cost: 12000, pricetype: 1, buildTime:  540, unlockLevel: 17 },
  ],
  plains:       [
    { level: 0, cost: 12000, pricetype: 1, buildTime: null, unlockLevel: null },
    { level: 1, cost:  6000, pricetype: 1, buildTime:  180, unlockLevel: 20 },
    { level: 2, cost: 12000, pricetype: 1, buildTime:  420, unlockLevel: 22 },
    { level: 3, cost: 24000, pricetype: 1, buildTime:  720, unlockLevel: 24 },
  ],
  forest:       [
    { level: 0, cost: 24000, pricetype: 1, buildTime: null, unlockLevel: null },
    { level: 1, cost: 12000, pricetype: 1, buildTime:  240, unlockLevel: 26 },
    { level: 2, cost: 24000, pricetype: 1, buildTime:  540, unlockLevel: 28 },
    { level: 3, cost: 48000, pricetype: 1, buildTime:  900, unlockLevel: 30 },
  ],
  mountain:     [
    { level: 0, cost: 36000, pricetype: 1, buildTime: null, unlockLevel: null },
    { level: 1, cost: 18000, pricetype: 1, buildTime:  300, unlockLevel: 32 },
    { level: 2, cost: 36000, pricetype: 1, buildTime:  660, unlockLevel: 34 },
    { level: 3, cost:   288, pricetype: 2, buildTime: 1080, unlockLevel: 36 },
  ],
  savanna:      [
    { level: 0, cost:   120, pricetype: 2, buildTime: null, unlockLevel: null },
    { level: 1, cost: 15000, pricetype: 1, buildTime:  360, unlockLevel: 40 },
    { level: 2, cost:   120, pricetype: 2, buildTime:  780, unlockLevel: 42 },
    { level: 3, cost:   240, pricetype: 2, buildTime: 1260, unlockLevel: 44 },
  ],
  jungle:       [
    { level: 0, cost:   160, pricetype: 2, buildTime: null, unlockLevel: null },
    { level: 1, cost:    80, pricetype: 2, buildTime:  420, unlockLevel: 44 },
    { level: 2, cost:   160, pricetype: 2, buildTime:  900, unlockLevel: 46 },
    { level: 3, cost:   320, pricetype: 2, buildTime: 1440, unlockLevel: 48 },
  ],
  ice:          [
    { level: 0, cost:   240, pricetype: 2, buildTime: null, unlockLevel: 61 },
    { level: 1, cost: 21000, pricetype: 1, buildTime:  660, unlockLevel: 66 },
    { level: 2, cost:   168, pricetype: 2, buildTime: 1440, unlockLevel: 71 },
    { level: 3, cost: 84000, pricetype: 1, buildTime: 2340, unlockLevel: 77 }, // 1d 15h
  ],
  water:        [
    { level: 0, cost:    175, pricetype: 2, buildTime: null, unlockLevel: 95 },
    { level: 1, cost:     88, pricetype: 2, buildTime: 1020, unlockLevel: 95 }, // 17h
    { level: 2, cost:    176, pricetype: 2, buildTime: 2100, unlockLevel: 97 }, // 1d 11h
    { level: 3, cost: 110000, pricetype: 1, buildTime: 3000, unlockLevel: 100 }, // 2d 2h
  ],
  leafy_thicket:[
    { level: 0, cost:  60000, pricetype: 1, buildTime: null, unlockLevel: 30 },
    { level: 1, cost:  30000, pricetype: 1, buildTime:  120, unlockLevel: 30 },
    { level: 2, cost:  60000, pricetype: 1, buildTime:  360, unlockLevel: 30 },
    { level: 3, cost: 120000, pricetype: 1, buildTime:  600, unlockLevel: 30 },
  ],
  rocky_desert: [
    { level: 0, cost:   130, pricetype: 2, buildTime: null, unlockLevel: 30 },
    { level: 1, cost: 16250, pricetype: 1, buildTime:  120, unlockLevel: 30 },
    { level: 2, cost:   130, pricetype: 2, buildTime:  300, unlockLevel: 30 },
    { level: 3, cost: 65000, pricetype: 1, buildTime:  600, unlockLevel: 30 },
  ],
  freshwater:   [
    { level: 0, cost:  80000, pricetype: 1, buildTime: null, unlockLevel: 50 },
    { level: 1, cost:  40000, pricetype: 1, buildTime:  120, unlockLevel: 50 },
    { level: 2, cost:  80000, pricetype: 1, buildTime:  300, unlockLevel: 50 },
    { level: 3, cost: 160000, pricetype: 1, buildTime:  600, unlockLevel: 50 },
  ],
  saltwater:    [
    { level: 0, cost:    140, pricetype: 2, buildTime: null, unlockLevel: 50 },
    { level: 1, cost:  17500, pricetype: 1, buildTime:  120, unlockLevel: 50 },
    { level: 2, cost:    140, pricetype: 2, buildTime:  300, unlockLevel: 50 },
    { level: 3, cost:  70000, pricetype: 1, buildTime:  600, unlockLevel: 50 },
  ],
  nocturnal:    [
    { level: 0, cost:    120, pricetype: 2, buildTime: null, unlockLevel: 80 },
    { level: 1, cost:  50000, pricetype: 1, buildTime:  780, unlockLevel: 80 }, // 13h
    { level: 2, cost:    140, pricetype: 2, buildTime: 1680, unlockLevel: 85 }, // 1d 4h
    { level: 3, cost: 150000, pricetype: 1, buildTime: 2700, unlockLevel: 90 }, // 1d 21h
  ],
  aviary:       [
    { level: 0, cost:    120, pricetype: 2, buildTime: null, unlockLevel: null },
    { level: 1, cost:  60000, pricetype: 1, buildTime:  900, unlockLevel: null }, // 15h
    { level: 2, cost:    150, pricetype: 2, buildTime: 1920, unlockLevel: null }, // 1d 8h
    { level: 3, cost: 175000, pricetype: 1, buildTime: 3000, unlockLevel: null }, // 2d 2h
  ],
  // rescue: no shelter
};

// ─── TROUGHS ─────────────────────────────────────────────────────────────────
const troughData: Record<string, { price: number; pricetype: number; repair: number }> = {
  grassland:    { price:  1000, pricetype: 1, repair: 0 },
  plains:       { price:  2000, pricetype: 1, repair: 0 },
  forest:       { price:  4000, pricetype: 1, repair: 0 },
  mountain:     { price:  6000, pricetype: 1, repair: 0 },
  savanna:      { price:    20, pricetype: 2, repair: 0 },
  jungle:       { price:    25, pricetype: 2, repair: 0 },
  ice:          { price:    27, pricetype: 2, repair: 0 },
  water:        { price:    30, pricetype: 2, repair: 0 },
  leafy_thicket:{ price:  5000, pricetype: 1, repair: 0 },
  rocky_desert: { price:    25, pricetype: 2, repair: 0 },
  freshwater:   { price: 25000, pricetype: 1, repair: 0 },
  saltwater:    { price:    35, pricetype: 2, repair: 0 },
  nocturnal:    { price: 25000, pricetype: 1, repair: 0 },
  aviary:       { price: 30000, pricetype: 1, repair: 0 },
  rescue:       { price:    49, pricetype: 2, repair: 0 },
};

// ─── WATER HOLES ─────────────────────────────────────────────────────────────
const waterHoleData: Record<string, { price: number; pricetype: number; repair: number }> = {
  grassland:    { price:  3000, pricetype: 1, repair:  100 },
  plains:       { price:    16, pricetype: 2, repair:  350 },
  forest:       { price: 12000, pricetype: 1, repair:  200 },
  mountain:     { price:    56, pricetype: 2, repair:  500 },
  savanna:      { price:    64, pricetype: 2, repair:  750 },
  jungle:       { price:    80, pricetype: 2, repair: 1000 },
  ice:          { price:    84, pricetype: 2, repair: 1250 },
  water:        { price:    90, pricetype: 2, repair: 1500 },
  leafy_thicket:{ price: 20000, pricetype: 1, repair: 1150 },
  rocky_desert: { price:    75, pricetype: 2, repair: 1350 },
  freshwater:   { price: 40000, pricetype: 1, repair: 1150 },
  saltwater:    { price:    85, pricetype: 2, repair: 1350 },
  nocturnal:    { price:    50, pricetype: 2, repair: 1350 },
  aviary:       { price:    55, pricetype: 2, repair: 2000 },
  rescue:       { price:    95, pricetype: 2, repair: 4000 },
};

// ─── GAMES ───────────────────────────────────────────────────────────────────
const gameData: Record<
  string,
  { identifier: string; price: number; pricetype: number; repair: number; texts: Texts }[]
> = {
  grassland: [
    { identifier: "play_trunk",   price: 2000, pricetype: 1, repair: 100, texts: { en: "Play Trunk",   de: "Spielstamm",        es: "Tronco de juego",     da: "Legestamme",       fr: "Tronc de jeu",       nl: "Speelstam"         } },
    { identifier: "play_hurdle",  price: 2000, pricetype: 1, repair: 100, texts: { en: "Play Hurdle",  de: "Spielhürde",        es: "Valla de juego",      da: "Legehæk",          fr: "Haie de jeu",        nl: "Speelhorde"        } },
    { identifier: "play_tree",    price: 2000, pricetype: 1, repair: 100, texts: { en: "Play Tree",    de: "Spielbaum",         es: "Árbol de juego",      da: "Legetræ",          fr: "Arbre de jeu",       nl: "Speelboom"         } },
    { identifier: "play_mudhole", price: 2000, pricetype: 1, repair: 100, texts: { en: "Play Mudhole", de: "Schlammloch",       es: "Charco de barro",     da: "Mudderhul",        fr: "Mare de boue",       nl: "Modderpoel"        } },
    { identifier: "play_pond",    price:    5, pricetype: 2, repair: 100, texts: { en: "Play Pond",    de: "Spielteich",        es: "Estanque de juego",   da: "Legedam",          fr: "Mare de jeu",        nl: "Speelvijver"       } },
  ],
  plains: [
    { identifier: "play_totem",   price:  4000, pricetype: 1, repair: 350, texts: { en: "Play Totem",   de: "Spieltotem",        es: "Tótem de juego",      da: "Legetotem",        fr: "Totem de jeu",       nl: "Speeltotem"        } },
    { identifier: "play_hill",    price:    12, pricetype: 2, repair: 350, texts: { en: "Play Hill",    de: "Spielhügel",        es: "Colina de juego",     da: "Legebakke",        fr: "Colline de jeu",     nl: "Speelheuvel"       } },
  ],
  forest: [
    { identifier: "play_rope",    price:  8000, pricetype: 1, repair: 200, texts: { en: "Play Rope",    de: "Spielseil",         es: "Cuerda de juego",     da: "Legesreb",         fr: "Corde de jeu",       nl: "Speeltouw"         } },
    { identifier: "play_rocks",   price:  8000, pricetype: 1, repair: 200, texts: { en: "Play Rocks",   de: "Spielfelsen",       es: "Rocas de juego",      da: "Legeklipper",      fr: "Rochers de jeu",     nl: "Speelrotsen"       } },
    { identifier: "play_tree",    price:    20, pricetype: 2, repair: 200, texts: { en: "Play Tree",    de: "Spielbaum",         es: "Árbol de juego",      da: "Legetræ",          fr: "Arbre de jeu",       nl: "Speelboom"         } },
  ],
  mountain: [
    { identifier: "play_tree",    price:    32, pricetype: 2, repair: 500, texts: { en: "Play Tree",    de: "Spielbaum",         es: "Árbol de juego",      da: "Legetræ",          fr: "Arbre de jeu",       nl: "Speelboom"         } },
    { identifier: "play_rocks",   price: 12000, pricetype: 1, repair: 500, texts: { en: "Play Rocks",   de: "Spielfelsen",       es: "Rocas de juego",      da: "Legeklipper",      fr: "Rochers de jeu",     nl: "Speelrotsen"       } },
  ],
  savanna: [
    { identifier: "play_plateau", price: 16000, pricetype: 1, repair: 750, texts: { en: "Play Plateau", de: "Spielplateau",      es: "Meseta de juego",     da: "Legeplateau",      fr: "Plateau de jeu",     nl: "Speelplateau"      } },
    { identifier: "play_mudhole", price:    45, pricetype: 2, repair: 750, texts: { en: "Play Mudhole", de: "Schlammloch",       es: "Charco de barro",     da: "Mudderhul",        fr: "Mare de boue",       nl: "Modderpoel"        } },
    { identifier: "play_tree",    price: 16000, pricetype: 1, repair: 750, texts: { en: "Play Tree",    de: "Spielbaum",         es: "Árbol de juego",      da: "Legetræ",          fr: "Arbre de jeu",       nl: "Speelboom"         } },
    { identifier: "play_pond",    price:    50, pricetype: 2, repair: 750, texts: { en: "Play Pond",    de: "Spielteich",        es: "Estanque de juego",   da: "Legedam",          fr: "Mare de jeu",        nl: "Speelvijver"       } },
  ],
  jungle: [
    { identifier: "play_swing",     price: 50, pricetype: 2, repair: 1000, texts: { en: "Play Swing",     de: "Spielschaukel",     es: "Columpio de juego",   da: "Legegynge",        fr: "Balançoire de jeu",  nl: "Speelschommel"     } },
    { identifier: "play_structure", price: 50, pricetype: 2, repair: 1000, texts: { en: "Play Structure", de: "Spielstruktur",     es: "Estructura de juego", da: "Legestruktur",     fr: "Structure de jeu",   nl: "Speelstructuur"    } },
    { identifier: "play_island",    price: 50, pricetype: 2, repair: 1000, texts: { en: "Play Island",    de: "Spielinsel",        es: "Isla de juego",       da: "Legeø",            fr: "Île de jeu",         nl: "Speeleiland"       } },
  ],
  ice: [
    { identifier: "ice_slide",    price: 55, pricetype: 2, repair: 1250, texts: { en: "Ice Slide",    de: "Eisrutsche",        es: "Tobogán de hielo",    da: "Isrutschebane",    fr: "Toboggan de glace",  nl: "IJsglijbaan"       } },
    { identifier: "play_rock",    price: 60, pricetype: 2, repair: 1250, texts: { en: "Play Rock",    de: "Spielfels",         es: "Roca de juego",       da: "Legeklippe",       fr: "Rocher de jeu",      nl: "Speelrots"         } },
    { identifier: "play_ropes",   price: 58, pricetype: 2, repair: 1250, texts: { en: "Play Ropes",   de: "Spielseile",        es: "Cuerdas de juego",    da: "Legesreb",         fr: "Cordes de jeu",      nl: "Speeltouwen"       } },
  ],
  water: [
    { identifier: "play_island",  price:    58, pricetype: 2, repair: 1500, texts: { en: "Play Island",  de: "Spielinsel",        es: "Isla de juego",       da: "Legeø",            fr: "Île de jeu",         nl: "Speeleiland"       } },
    { identifier: "play_arch",    price: 22000, pricetype: 1, repair: 1500, texts: { en: "Play Arch",    de: "Spielbogen",        es: "Arco de juego",       da: "Legebue",          fr: "Arc de jeu",         nl: "Speelboog"         } },
  ],
  leafy_thicket: [
    { identifier: "play_wheel",     price:    50, pricetype: 2, repair: 1150, texts: { en: "Play Wheel",     de: "Spielrad",          es: "Rueda de juego",      da: "Legehjul",         fr: "Roue de jeu",        nl: "Speelwiel"         } },
    { identifier: "play_leaf_pile", price: 15000, pricetype: 1, repair: 1150, texts: { en: "Play Leaf Pile", de: "Laubhaufen",        es: "Montón de hojas",     da: "Løvbunke",         fr: "Tas de feuilles",    nl: "Bladerhoop"        } },
  ],
  rocky_desert: [
    { identifier: "play_see_saw",      price: 55, pricetype: 2, repair: 1350, texts: { en: "Play See-Saw",      de: "Spielwippe",        es: "Balancín de juego",   da: "Legevippe",        fr: "Balançoire de jeu",  nl: "Speelwip"          } },
    { identifier: "play_horned_rocks", price: 55, pricetype: 2, repair: 1350, texts: { en: "Play Horned Rocks", de: "Gehörnte Felsen",   es: "Rocas con cuernos",   da: "Hornede klipper",  fr: "Rochers à cornes",   nl: "Gehoornde rotsen"  } },
  ],
  freshwater: [
    { identifier: "play_plant", price: 35000, pricetype: 1, repair: 1150, texts: { en: "Play Plant", de: "Spielpflanze",      es: "Planta de juego",     da: "Legeplante",       fr: "Plante de jeu",      nl: "Speelplant"        } },
    { identifier: "play_wreck", price:    60, pricetype: 2, repair: 1150, texts: { en: "Play Wreck", de: "Spielwrack",        es: "Pecio de juego",      da: "Legevrag",         fr: "Épave de jeu",       nl: "Speelwrak"         } },
  ],
  saltwater: [
    { identifier: "play_arch",        price: 65, pricetype: 2, repair: 1350, texts: { en: "Play Arch",         de: "Spielbogen",        es: "Arco de juego",       da: "Legebue",          fr: "Arc de jeu",         nl: "Speelboog"         } },
    { identifier: "play_ships_wheel", price: 65, pricetype: 2, repair: 1350, texts: { en: "Play Ship's Wheel", de: "Steuerrad",         es: "Timón de juego",      da: "Skibsrat",         fr: "Gouvernail de jeu",  nl: "Scheepsroer"       } },
  ],
  nocturnal: [
    { identifier: "toy", price: 60, pricetype: 2, repair: 1350, texts: { en: "Toy", de: "Spielzeug", es: "Juguete", da: "Legetøj", fr: "Jouet", nl: "Speelgoed" } },
  ],
  aviary: [
    { identifier: "play_bamboo_equipment", price: 45000, pricetype: 1, repair: 2000, texts: { en: "Play Bamboo Equipment", de: "Bambus-Spielausrüstung",  es: "Equipo de bambú",        da: "Bambuslegeudstyr",     fr: "Équipement bambou",      nl: "Bambusspeeltuig"    } },
    { identifier: "play_wooden_equipment", price:    65, pricetype: 2, repair: 2000, texts: { en: "Play Wooden Equipment", de: "Holz-Spielausrüstung",    es: "Equipo de madera",       da: "Trælegeudstyr",        fr: "Équipement en bois",     nl: "Houten speeltuig"   } },
  ],
};

// ─── DECORATIONS ─────────────────────────────────────────────────────────────
const decorationData: Record<
  string,
  { identifier: string; price: number; pricetype: number; popularity: number; texts: Texts }[]
> = {
  grassland: [
    { identifier: "wildflowers",            price: 1000,  pricetype: 1, popularity:  40, texts: { en: "Wildflowers",            de: "Wildblumen",              es: "Flores silvestres",       da: "Vilde blomster",          fr: "Fleurs sauvages",         nl: "Wilde bloemen"          } },
    { identifier: "sunflower",              price:  250,  pricetype: 1, popularity:  10, texts: { en: "Sunflower",              de: "Sonnenblume",             es: "Girasol",                 da: "Solsikke",                fr: "Tournesol",               nl: "Zonnebloem"             } },
    { identifier: "haybale",               price:  500,  pricetype: 1, popularity:  20, texts: { en: "Haybale",               de: "Heuballen",               es: "Fardo de heno",           da: "Høballe",                 fr: "Botte de foin",           nl: "Hooibaal"               } },
    { identifier: "scarecrow",             price:    4,  pricetype: 2, popularity:  35, texts: { en: "Scarecrow",             de: "Vogelscheuche",           es: "Espantapájaros",          da: "Fugleskræmsel",           fr: "Épouvantail",             nl: "Vogelverschrikker"      } },
    { identifier: "chestnut",              price: 1500,  pricetype: 1, popularity:  60, texts: { en: "Chestnut",              de: "Kastanie",                es: "Castaño",                 da: "Kastanje",                fr: "Châtaignier",             nl: "Kastanjeboom"           } },
    { identifier: "grass_bushel",          price: 2000,  pricetype: 1, popularity:  80, texts: { en: "Grass Bushel",          de: "Grasbüschel",             es: "Manojo de hierba",        da: "Græsbundt",               fr: "Botte d'herbe",           nl: "Graspol"                } },
    { identifier: "info_board_grassland",  price:40000,  pricetype: 1, popularity: 400, texts: { en: "Info Board (Grassland)", de: "Infotafel (Grasland)",    es: "Panel informativo (Prado)",da: "Infotavle (Eng)",         fr: "Panneau (Prairies)",      nl: "Infobord (Grasland)"    } },
    { identifier: "wheelbarrow",           price:   15,  pricetype: 2, popularity: 150, texts: { en: "Wheelbarrow",           de: "Schubkarre",              es: "Carretilla",              da: "Trillebør",               fr: "Brouette",                nl: "Kruiwagen"              } },
    { identifier: "hummock",              price:   10,  pricetype: 2, popularity: 100, texts: { en: "Hummock",              de: "Hügel",                   es: "Montículo",               da: "Tue",                     fr: "Butte",                   nl: "Heuveltje"              } },
    { identifier: "stone",               price: 2250,  pricetype: 1, popularity:  90, texts: { en: "Stone",               de: "Stein",                   es: "Piedra",                  da: "Sten",                    fr: "Pierre",                  nl: "Steen"                  } },
    { identifier: "bamboo",              price:   12,  pricetype: 2, popularity: 120, texts: { en: "Bamboo",              de: "Bambus",                  es: "Bambú",                   da: "Bambus",                  fr: "Bambou",                  nl: "Bamboe"                 } },
    { identifier: "large_nest",          price:    8,  pricetype: 2, popularity:  80, texts: { en: "Large Nest",          de: "Großes Nest",             es: "Nido grande",             da: "Stort rede",              fr: "Grand nid",               nl: "Groot nest"             } },
    { identifier: "small_nest",          price:   10,  pricetype: 2, popularity: 100, texts: { en: "Small Nest",          de: "Kleines Nest",            es: "Nido pequeño",            da: "Lille rede",              fr: "Petit nid",               nl: "Klein nest"             } },
    { identifier: "decorative_house",    price:   25,  pricetype: 2, popularity: 250, texts: { en: "Decorative House",    de: "Dekoratives Haus",        es: "Casa decorativa",         da: "Dekorativt hus",          fr: "Maison décorative",       nl: "Decoratief huis"        } },
  ],
  plains: [
    { identifier: "dandelion",           price:    3, pricetype: 2, popularity:  30, texts: { en: "Dandelion",           de: "Löwenzahn",               es: "Diente de león",          da: "Mælkebøtte",              fr: "Pissenlit",               nl: "Paardenbloem"           } },
    { identifier: "sandstone_formation", price:    5, pricetype: 2, popularity:  45, texts: { en: "Sandstone Formation", de: "Sandsteinformation",      es: "Formación de arenisca",   da: "Sandstensformation",      fr: "Formation de grès",       nl: "Zandsteen formatie"     } },
    { identifier: "bush",               price:    6, pricetype: 2, popularity:  60, texts: { en: "Bush",               de: "Busch",                   es: "Arbusto",                 da: "Busk",                    fr: "Buisson",                 nl: "Struik"                 } },
    { identifier: "tussock_grass",      price:  750, pricetype: 1, popularity:  30, texts: { en: "Tussock Grass",      de: "Büschelgras",             es: "Pasto en matas",          da: "Tuegræs",                 fr: "Graminée en touffe",      nl: "Polgraas"               } },
    { identifier: "rocks",              price:  300, pricetype: 1, popularity:  12, texts: { en: "Rocks",              de: "Felsen",                  es: "Rocas",                   da: "Klipper",                 fr: "Rochers",                 nl: "Rotsen"                 } },
    { identifier: "white_gaura",        price: 2500, pricetype: 1, popularity:  95, texts: { en: "White Gaura",        de: "Weiße Gaura",             es: "Gaura blanca",            da: "Hvid gaura",              fr: "Gaura blanc",             nl: "Witte gaura"            } },
    { identifier: "yellow_gaura",       price: 2500, pricetype: 1, popularity:  95, texts: { en: "Yellow Gaura",       de: "Gelbe Gaura",             es: "Gaura amarilla",          da: "Gul gaura",               fr: "Gaura jaune",             nl: "Gele gaura"             } },
    { identifier: "purple_gaura",       price: 2500, pricetype: 1, popularity:  95, texts: { en: "Purple Gaura",       de: "Lila Gaura",              es: "Gaura morada",            da: "Lilla gaura",             fr: "Gaura violet",            nl: "Paarse gaura"           } },
    { identifier: "purple_poppy",       price: 3125, pricetype: 1, popularity: 115, texts: { en: "Purple Poppy",       de: "Lila Mohn",               es: "Amapola morada",          da: "Lilla valmue",            fr: "Coquelicot violet",       nl: "Paarse papaver"         } },
    { identifier: "white_poppy",        price: 3125, pricetype: 1, popularity: 115, texts: { en: "White Poppy",        de: "Weißer Mohn",             es: "Amapola blanca",          da: "Hvid valmue",             fr: "Coquelicot blanc",        nl: "Witte papaver"          } },
    { identifier: "yellow_poppy",       price: 3125, pricetype: 1, popularity: 115, texts: { en: "Yellow Poppy",       de: "Gelber Mohn",             es: "Amapola amarilla",        da: "Gul valmue",              fr: "Coquelicot jaune",        nl: "Gele papaver"           } },
    { identifier: "plains_arch",        price:   15, pricetype: 2, popularity: 150, texts: { en: "Plains Arch",        de: "Steppenbogen",            es: "Arco de llanuras",        da: "Slettebue",               fr: "Arc des plaines",         nl: "Vlakten boog"           } },
    { identifier: "old_tree",           price:   13, pricetype: 2, popularity: 125, texts: { en: "Old Tree",           de: "Alter Baum",              es: "Árbol viejo",             da: "Gammelt træ",             fr: "Vieil arbre",             nl: "Oude boom"              } },
    { identifier: "sagebrush",          price:   10, pricetype: 2, popularity: 100, texts: { en: "Sagebrush",          de: "Beifußstrauch",           es: "Artemisa",                da: "Malurtbusk",              fr: "Armoise",                 nl: "Saliestengel"           } },
  ],
  forest: [
    { identifier: "fir",               price:    3, pricetype: 2, popularity:  25, texts: { en: "Fir",               de: "Tanne",                   es: "Abeto",                   da: "Ædelgran",                fr: "Sapin",                   nl: "Den"                    } },
    { identifier: "mossy_rock",        price:  625, pricetype: 1, popularity:  25, texts: { en: "Mossy Rock",        de: "Moosiger Stein",          es: "Roca musgosa",            da: "Mosbelagt sten",          fr: "Pierre mousseuse",        nl: "Bemoste steen"          } },
    { identifier: "tree_stump",        price:    4, pricetype: 2, popularity:  40, texts: { en: "Tree Stump",        de: "Baumstumpf",              es: "Tocón de árbol",          da: "Træstub",                 fr: "Souche d'arbre",          nl: "Boomstronk"             } },
    { identifier: "spruce",            price:    5, pricetype: 2, popularity:  50, texts: { en: "Spruce",            de: "Fichte",                  es: "Pícea",                   da: "Gran",                    fr: "Épicéa",                  nl: "Spar"                   } },
    { identifier: "mushrooms",         price: 2000, pricetype: 1, popularity:  80, texts: { en: "Mushrooms",         de: "Pilze",                   es: "Setas",                   da: "Svampe",                  fr: "Champignons",             nl: "Paddenstoelen"          } },
    { identifier: "log_pile",          price:    9, pricetype: 2, popularity:  90, texts: { en: "Log Pile",          de: "Holzstapel",              es: "Pila de troncos",         da: "Træstabel",               fr: "Tas de bûches",           nl: "Houtblokstapel"         } },
    { identifier: "info_board_forest", price:15000, pricetype: 1, popularity: 600, texts: { en: "Info Board (Forest)",de: "Infotafel (Wald)",        es: "Panel informativo (Bosque)",da: "Infotavle (Skov)",       fr: "Panneau (Forêt)",         nl: "Infobord (Bos)"         } },
    { identifier: "windflower",        price: 2000, pricetype: 1, popularity:  80, texts: { en: "Windflower",        de: "Windröschen",             es: "Anémona",                 da: "Anemone",                 fr: "Anémone",                 nl: "Anemoon"                } },
    { identifier: "rivulet",           price:   10, pricetype: 2, popularity: 100, texts: { en: "Rivulet",           de: "Bächlein",                es: "Riachuelo",               da: "Bæk",                     fr: "Ruisselet",               nl: "Beekje"                 } },
    { identifier: "berry_bush",        price:    8, pricetype: 2, popularity:  80, texts: { en: "Berry Bush",        de: "Beerenstrauch",           es: "Arbusto de bayas",        da: "Bærbusk",                 fr: "Buisson à baies",         nl: "Bessenstruik"           } },
    { identifier: "river_red_gum",     price:   15, pricetype: 2, popularity: 150, texts: { en: "River Red Gum",     de: "Roter Flussgummibaum",    es: "Eucalipto rojo",          da: "Rødt flodeukalipt",       fr: "Eucalyptus rouge",        nl: "Rode rivier gomboom"    } },
    { identifier: "den",               price:   20, pricetype: 2, popularity: 200, texts: { en: "Den",               de: "Höhle",                   es: "Guarida",                 da: "Hule",                    fr: "Tanière",                 nl: "Hol"                    } },
  ],
  mountain: [
    { identifier: "alpine_gentian",       price:  1250, pricetype: 1, popularity:  50, texts: { en: "Alpine Gentian",       de: "Alpenenzian",             es: "Genciana alpina",         da: "Alpegentian",             fr: "Gentiane alpine",         nl: "Alpengentiaan"          } },
    { identifier: "tree_trunk",           price:     7, pricetype: 2, popularity:  70, texts: { en: "Tree Trunk",           de: "Baumstamm",               es: "Tronco de árbol",         da: "Træstamme",               fr: "Tronc d'arbre",           nl: "Boomstam"               } },
    { identifier: "rocks",               price:     9, pricetype: 2, popularity:  90, texts: { en: "Rocks",               de: "Felsen",                  es: "Rocas",                   da: "Klipper",                 fr: "Rochers",                 nl: "Rotsen"                 } },
    { identifier: "japanese_maple",       price:    14, pricetype: 2, popularity: 140, texts: { en: "Japanese Maple",       de: "Japanischer Ahorn",       es: "Arce japonés",            da: "Japansk ahorn",           fr: "Érable japonais",         nl: "Japanse esdoorn"        } },
    { identifier: "rock_arch",           price:    20, pricetype: 2, popularity: 200, texts: { en: "Rock Arch",           de: "Felsbogen",               es: "Arco de roca",            da: "Klippebue",               fr: "Arc de rocher",           nl: "Rotsboog"               } },
    { identifier: "alpine_rose",         price:  3000, pricetype: 1, popularity: 120, texts: { en: "Alpine Rose",         de: "Alpenrose",               es: "Rosa alpina",             da: "Alperose",                fr: "Rose des Alpes",          nl: "Alpenroos"              } },
    { identifier: "info_board_mountain", price: 17500, pricetype: 1, popularity: 700, texts: { en: "Info Board (Mountain)",de: "Infotafel (Berg)",        es: "Panel informativo (Montaña)",da: "Infotavle (Bjerg)",      fr: "Panneau (Montagne)",      nl: "Infobord (Berg)"        } },
    { identifier: "glacier_buttercup",   price:    13, pricetype: 2, popularity: 130, texts: { en: "Glacier Buttercup",   de: "Gletscherhahnenfuß",      es: "Ranúnculo glaciar",       da: "Gletjerranunkel",         fr: "Bouton d'or glaciaire",   nl: "Gletsjer boterbloem"    } },
    { identifier: "dragon_rock",         price:  3250, pricetype: 1, popularity: 130, texts: { en: "Dragon Rock",         de: "Drachenfels",             es: "Roca dragón",             da: "Drakeklippe",             fr: "Rocher dragon",           nl: "Draaksteen"             } },
    { identifier: "waterfall",           price:    21, pricetype: 2, popularity: 210, texts: { en: "Waterfall",           de: "Wasserfall",              es: "Cascada",                 da: "Vandfald",                fr: "Cascade",                 nl: "Waterval"               } },
  ],
  savanna: [
    { identifier: "decorative_cactus",     price:  1750, pricetype: 1, popularity:  70, texts: { en: "Decorative Cactus",     de: "Dekorativer Kaktus",      es: "Cactus decorativo",       da: "Dekorativ kaktus",        fr: "Cactus décoratif",        nl: "Decoratieve cactus"     } },
    { identifier: "skull",                price:     8, pricetype: 2, popularity:  80, texts: { en: "Skull",                de: "Schädel",                 es: "Calavera",                da: "Kranium",                 fr: "Crâne",                   nl: "Schedel"                } },
    { identifier: "cactus",               price:    10, pricetype: 2, popularity: 100, texts: { en: "Cactus",               de: "Kaktus",                  es: "Cactus",                  da: "Kaktus",                  fr: "Cactus",                  nl: "Cactus"                 } },
    { identifier: "umbrella_acacia",      price:    16, pricetype: 2, popularity: 160, texts: { en: "Umbrella Acacia",      de: "Schirmakazie",            es: "Acacia paraguas",         da: "Paraplyakacia",           fr: "Acacia parapluie",        nl: "Parasol acacia"         } },
    { identifier: "large_rocks",          price:    23, pricetype: 2, popularity: 225, texts: { en: "Large Rocks",          de: "Große Felsen",            es: "Rocas grandes",           da: "Store klipper",           fr: "Grandes roches",          nl: "Grote rotsen"           } },
    { identifier: "yellow_oxalis",        price:    13, pricetype: 2, popularity: 125, texts: { en: "Yellow Oxalis",        de: "Gelber Sauerklee",        es: "Oxalis amarilla",         da: "Gul skovsyre",            fr: "Oxalis jaune",            nl: "Gele klaverzuring"      } },
    { identifier: "purple_oxalis",        price:  3125, pricetype: 1, popularity: 125, texts: { en: "Purple Oxalis",        de: "Lila Sauerklee",          es: "Oxalis morada",           da: "Lilla skovsyre",          fr: "Oxalis violet",           nl: "Paarse klaverzuring"    } },
    { identifier: "blue_oxalis",          price:    13, pricetype: 2, popularity: 125, texts: { en: "Blue Oxalis",          de: "Blauer Sauerklee",        es: "Oxalis azul",             da: "Blå skovsyre",            fr: "Oxalis bleu",             nl: "Blauwe klaverzuring"    } },
    { identifier: "red_oxalis",           price:    18, pricetype: 2, popularity: 175, texts: { en: "Red Oxalis",           de: "Roter Sauerklee",         es: "Oxalis roja",             da: "Rød skovsyre",            fr: "Oxalis rouge",            nl: "Rode klaverzuring"      } },
    { identifier: "info_board_savanna",   price: 20000, pricetype: 1, popularity: 125, texts: { en: "Info Board (Savanna)", de: "Infotafel (Savanne)",     es: "Panel informativo (Sabana)",da: "Infotavle (Savanne)",    fr: "Panneau (Savane)",        nl: "Infobord (Savanne)"     } },
    { identifier: "red_milkweed",         price:    15, pricetype: 2, popularity: 150, texts: { en: "Red Milkweed",         de: "Rotes Seidenkraut",       es: "Algodoncillo rojo",       da: "Rød silkeplante",         fr: "Asclépiade rouge",        nl: "Rode zijdeplant"        } },
    { identifier: "orange_milkweed",      price:  3750, pricetype: 1, popularity: 150, texts: { en: "Orange Milkweed",      de: "Oranges Seidenkraut",     es: "Algodoncillo naranja",    da: "Orange silkeplante",      fr: "Asclépiade orange",       nl: "Oranje zijdeplant"      } },
    { identifier: "blue_milkweed",        price:    15, pricetype: 2, popularity: 150, texts: { en: "Blue Milkweed",        de: "Blaues Seidenkraut",      es: "Algodoncillo azul",       da: "Blå silkeplante",         fr: "Asclépiade bleu",         nl: "Blauwe zijdeplant"      } },
    { identifier: "purple_milkweed",      price:    20, pricetype: 2, popularity: 200, texts: { en: "Purple Milkweed",      de: "Lila Seidenkraut",        es: "Algodoncillo morado",     da: "Lilla silkeplante",       fr: "Asclépiade violet",       nl: "Paarse zijdeplant"      } },
    { identifier: "round_cactus",         price:  3000, pricetype: 1, popularity: 120, texts: { en: "Round Cactus",         de: "Runder Kaktus",           es: "Cactus redondo",          da: "Rund kaktus",             fr: "Cactus rond",             nl: "Ronde cactus"           } },
    { identifier: "desert_rose",          price:    25, pricetype: 2, popularity: 250, texts: { en: "Desert Rose",          de: "Wüstenrose",              es: "Rosa del desierto",       da: "Ørkens rose",             fr: "Rose du désert",          nl: "Woestijnroos"           } },
    { identifier: "oasis",                price:    25, pricetype: 2, popularity: 250, texts: { en: "Oasis",                de: "Oase",                    es: "Oasis",                   da: "Oase",                    fr: "Oasis",                   nl: "Oase"                   } },
    { identifier: "karlu_karlu",          price:    12, pricetype: 2, popularity: 120, texts: { en: "Karlu Karlu",          de: "Karlu Karlu",             es: "Karlu Karlu",             da: "Karlu Karlu",             fr: "Karlu Karlu",             nl: "Karlu Karlu"            } },
    { identifier: "baobab",               price:    25, pricetype: 2, popularity: 250, texts: { en: "Baobab",               de: "Baobab",                  es: "Baobab",                  da: "Baobab",                  fr: "Baobab",                  nl: "Baobab"                 } },
    { identifier: "grass_bushel_savanna", price:    15, pricetype: 2, popularity: 150, texts: { en: "Grass Bushel",         de: "Grasbüschel",             es: "Manojo de hierba",        da: "Græsbundt",               fr: "Botte d'herbe",           nl: "Graspol"                } },
    { identifier: "termite_mound",        price:    15, pricetype: 2, popularity: 150, texts: { en: "Termite Mound",        de: "Termitenhügel",           es: "Termitero",               da: "Termittu",                fr: "Termitière",              nl: "Termietenheuvel"        } },
    { identifier: "small_kopjes",         price:    25, pricetype: 2, popularity: 150, texts: { en: "Small Kopjes",         de: "Kleine Kopjes",           es: "Kopjes pequeños",         da: "Små kopjes",              fr: "Petits kopjes",           nl: "Kleine kopjes"          } },
    { identifier: "medium_kopjes",        price:    35, pricetype: 2, popularity: 250, texts: { en: "Medium Kopjes",        de: "Mittlere Kopjes",         es: "Kopjes medianos",         da: "Mellemstore kopjes",      fr: "Kopjes moyens",           nl: "Middelgrote kopjes"     } },
    { identifier: "large_kopjes",         price:    45, pricetype: 2, popularity: 350, texts: { en: "Large Kopjes",         de: "Große Kopjes",            es: "Kopjes grandes",          da: "Store kopjes",            fr: "Grands kopjes",           nl: "Grote kopjes"           } },
  ],
  jungle: [
    { identifier: "orchids",            price:  2500, pricetype: 1, popularity: 100, texts: { en: "Orchids",            de: "Orchideen",               es: "Orquídeas",               da: "Orkidéer",                fr: "Orchidées",               nl: "Orchideeën"             } },
    { identifier: "philodendron",       price:    12, pricetype: 2, popularity: 120, texts: { en: "Philodendron",       de: "Philodendron",            es: "Filodendro",              da: "Filodendron",             fr: "Philodendron",            nl: "Philodendron"           } },
    { identifier: "small_palm_tree",    price:    18, pricetype: 2, popularity: 180, texts: { en: "Small Palm Tree",    de: "Kleine Palme",            es: "Palmera pequeña",         da: "Lille palme",             fr: "Petit palmier",           nl: "Kleine palmboom"        } },
    { identifier: "decorative_rock",    price:    30, pricetype: 2, popularity: 300, texts: { en: "Decorative Rock",    de: "Dekorativer Fels",        es: "Roca decorativa",         da: "Dekorativ klippe",        fr: "Rocher décoratif",        nl: "Decoratieve rots"       } },
    { identifier: "aspidistra",         price:  2000, pricetype: 1, popularity:  80, texts: { en: "Aspidistra",         de: "Aspidistra",              es: "Aspidistra",              da: "Aspidistra",              fr: "Aspidistra",              nl: "Aspidistra"             } },
    { identifier: "old_temple_pillar",  price:  5000, pricetype: 1, popularity: 200, texts: { en: "Old Temple Pillar",  de: "Alter Tempelpfeiler",     es: "Pilar de templo antiguo", da: "Gammel tempelsøjle",      fr: "Pilier de temple ancien", nl: "Oude tempelzuil"        } },
    { identifier: "rafflesia",          price:    15, pricetype: 2, popularity: 150, texts: { en: "Rafflesia",          de: "Rafflesia",               es: "Rafflesia",               da: "Rafflesia",               fr: "Rafflesia",               nl: "Rafflesia"              } },
    { identifier: "sundew",             price:    20, pricetype: 2, popularity: 200, texts: { en: "Sundew",             de: "Sonnentau",               es: "Rocío del sol",           da: "Soldug",                  fr: "Rossolis",                nl: "Zonnedauw"              } },
    { identifier: "kapok_stump_cave",   price:     9, pricetype: 2, popularity:  90, texts: { en: "Kapok Stump Cave",   de: "Kapok-Stumpfhöhle",       es: "Cueva de kapok",          da: "Kapokstubs hule",         fr: "Grotte kapok",            nl: "Kapok stomp grot"       } },
    { identifier: "taro",              price:    18, pricetype: 2, popularity: 120, texts: { en: "Taro",              de: "Taro",                    es: "Taro",                    da: "Taro",                    fr: "Taro",                    nl: "Taro"                   } },
    { identifier: "info_board_jungle",  price:    18, pricetype: 2, popularity: 120, texts: { en: "Info Board (Jungle)", de: "Infotafel (Dschungel)",  es: "Panel informativo (Selva)",da: "Infotavle (Jungle)",      fr: "Panneau (Jungle)",        nl: "Infobord (Jungle)"      } },
    { identifier: "kapok",             price:    19, pricetype: 2, popularity: 190, texts: { en: "Kapok",             de: "Kapokbaum",               es: "Ceiba",                   da: "Kapok",                   fr: "Fromager",                nl: "Kapokboom"              } },
    { identifier: "jungle_arch",        price:  3750, pricetype: 1, popularity: 150, texts: { en: "Jungle Arch",        de: "Dschungelbogen",          es: "Arco de la selva",        da: "Junglebue",               fr: "Arc de jungle",           nl: "Jungleboog"             } },
    { identifier: "temple_relic",       price:    29, pricetype: 2, popularity: 290, texts: { en: "Temple Relic",       de: "Tempelrelikt",            es: "Reliquia del templo",     da: "Tempelrelikt",            fr: "Relique du temple",       nl: "Tempelrelikvie"         } },
    { identifier: "venus_fly_trap",     price:    22, pricetype: 2, popularity: 220, texts: { en: "Venus Fly Trap",     de: "Venusfliegenfalle",       es: "Atrapamoscas de Venus",   da: "Venusflueblomst",         fr: "Dionée attrape-mouche",   nl: "Vleesetende plant"      } },
    { identifier: "pitcher_plant",      price:    24, pricetype: 2, popularity: 240, texts: { en: "Pitcher Plant",      de: "Kannenpflanze",           es: "Planta jarro",            da: "Kanneblad",               fr: "Plante carnivore",        nl: "Bekerplant"             } },
    { identifier: "aztec_waterfall",    price:    25, pricetype: 2, popularity: 250, texts: { en: "Aztec Waterfall",    de: "Aztekenwasserfall",       es: "Cascada azteca",          da: "Aztek vandfald",          fr: "Cascade aztèque",         nl: "Azteekse waterval"      } },
    { identifier: "climbing_structure", price:    27, pricetype: 2, popularity: 270, texts: { en: "Climbing Structure", de: "Kletterstruktur",         es: "Estructura para trepar",  da: "Klatrestruktur",          fr: "Structure d'escalade",    nl: "Klimstructuur"          } },
  ],
  ice: [
    { identifier: "bush",              price: 4375, pricetype: 1, popularity: 175, texts: { en: "Bush",              de: "Busch",                   es: "Arbusto",                 da: "Busk",                    fr: "Buisson",                 nl: "Struik"                 } },
    { identifier: "large_snowball",    price:   14, pricetype: 2, popularity: 140, texts: { en: "Large Snowball",    de: "Großer Schneeball",       es: "Bola de nieve grande",    da: "Stor snebold",            fr: "Grande boule de neige",   nl: "Grote sneeuwbal"        } },
    { identifier: "ice_arch",         price:    4, pricetype: 2, popularity:  80, texts: { en: "Ice Arch",         de: "Eisbogen",                es: "Arco de hielo",           da: "Isbue",                   fr: "Arc de glace",            nl: "IJsboog"                } },
    { identifier: "icy_shrub",        price: 1000, pricetype: 1, popularity:  40, texts: { en: "Icy Shrub",        de: "Eisiger Strauch",         es: "Arbusto helado",          da: "Iskoldt busk",            fr: "Arbuste glacé",           nl: "IJzige struik"          } },
    { identifier: "small_snowball",   price: 2875, pricetype: 1, popularity: 115, texts: { en: "Small Snowball",   de: "Kleiner Schneeball",      es: "Bola de nieve pequeña",   da: "Lille snebold",           fr: "Petite boule de neige",   nl: "Kleine sneeuwbal"       } },
    { identifier: "rock",            price:   33, pricetype: 2, popularity: 330, texts: { en: "Rock",            de: "Fels",                    es: "Roca",                    da: "Klippe",                  fr: "Rocher",                  nl: "Rots"                   } },
    { identifier: "tree_stump",      price: 2000, pricetype: 1, popularity:  80, texts: { en: "Tree Stump",      de: "Baumstumpf",              es: "Tocón de árbol",          da: "Træstub",                 fr: "Souche d'arbre",          nl: "Boomstronk"             } },
    { identifier: "bearberries",     price:   27, pricetype: 2, popularity: 265, texts: { en: "Bearberries",     de: "Bärentrauben",            es: "Gayuba",                  da: "Melbærris",               fr: "Raisin d'ours",           nl: "Berenbes"               } },
    { identifier: "info_board_ice",  price:   15, pricetype: 2, popularity: 150, texts: { en: "Info Board (Ice)", de: "Infotafel (Eis)",         es: "Panel informativo (Hielo)",da: "Infotavle (Is)",          fr: "Panneau (Glace)",         nl: "Infobord (IJs)"         } },
    { identifier: "sami_statue",     price: 4000, pricetype: 1, popularity: 160, texts: { en: "Sami Statue",     de: "Sami-Statue",             es: "Estatua Sami",            da: "Sami-statue",             fr: "Statue Sami",             nl: "Sami standbeeld"        } },
    { identifier: "white_saxifrage", price:   13, pricetype: 2, popularity: 125, texts: { en: "White Saxifrage", de: "Weißer Steinbrech",       es: "Saxífraga blanca",        da: "Hvid stenbræk",           fr: "Saxifrage blanc",         nl: "Witte steenbreek"       } },
    { identifier: "pink_saxifrage",  price:   13, pricetype: 2, popularity: 125, texts: { en: "Pink Saxifrage",  de: "Rosa Steinbrech",         es: "Saxífraga rosa",          da: "Lyserød stenbræk",        fr: "Saxifrage rose",          nl: "Roze steenbreek"        } },
    { identifier: "purple_saxifrage",price:   18, pricetype: 2, popularity: 130, texts: { en: "Purple Saxifrage",de: "Lila Steinbrech",         es: "Saxífraga morada",        da: "Lilla stenbræk",          fr: "Saxifrage violet",        nl: "Paarse steenbreek"      } },
    { identifier: "mossy_rock",      price: 4375, pricetype: 1, popularity: 140, texts: { en: "Mossy Rock",      de: "Moosiger Fels",           es: "Roca musgosa",            da: "Mosbelagt klippe",        fr: "Rocher moussu",           nl: "Bemoste rots"           } },
    { identifier: "ships_wheel",     price:    8, pricetype: 2, popularity: 120, texts: { en: "Ship's Wheel",    de: "Steuerrad",               es: "Timón",                   da: "Skibsrat",                fr: "Gouvernail",              nl: "Scheepsroer"            } },
    { identifier: "old_tree",        price:   15, pricetype: 2, popularity: 150, texts: { en: "Old Tree",        de: "Alter Baum",              es: "Árbol viejo",             da: "Gammelt træ",             fr: "Vieil arbre",             nl: "Oude boom"              } },
    { identifier: "ice_hole",        price: 4375, pricetype: 1, popularity: 175, texts: { en: "Ice Hole",        de: "Eisloch",                 es: "Agujero de hielo",        da: "Ishul",                   fr: "Trou dans la glace",      nl: "IJsgat"                 } },
    { identifier: "christmas_fir",   price:   10, pricetype: 2, popularity: 100, texts: { en: "Christmas Fir",   de: "Weihnachtstanne",         es: "Abeto navideño",          da: "Juletræ",                 fr: "Sapin de Noël",           nl: "Kerstden"               } },
  ],
  water: [
    { identifier: "lifesaver",         price:  2500, pricetype: 1, popularity: 100, texts: { en: "Lifesaver",         de: "Rettungsring",            es: "Salvavidas",              da: "Redningskrans",           fr: "Bouée de sauvetage",      nl: "Reddingsboei"           } },
    { identifier: "water_lilies",      price:    13, pricetype: 2, popularity: 125, texts: { en: "Water Lilies",      de: "Seerosen",                es: "Nenúfares",               da: "Åkander",                 fr: "Nénuphars",               nl: "Waterlelies"            } },
    { identifier: "shipwreck",         price:    34, pricetype: 2, popularity: 340, texts: { en: "Shipwreck",         de: "Schiffswrack",            es: "Naufragio",               da: "Skibsvrag",               fr: "Épave",                   nl: "Scheepswrak"            } },
    { identifier: "lighthouse",        price:  7250, pricetype: 1, popularity: 290, texts: { en: "Lighthouse",        de: "Leuchtturm",              es: "Faro",                    da: "Fyrtårn",                 fr: "Phare",                   nl: "Vuurtoren"              } },
    { identifier: "mangrove",          price:    23, pricetype: 2, popularity: 230, texts: { en: "Mangrove",          de: "Mangrove",                es: "Mangle",                  da: "Mangrove",                fr: "Mangrove",                nl: "Mangroveboom"           } },
    { identifier: "mermaid_sculpture", price:    39, pricetype: 2, popularity: 390, texts: { en: "Mermaid Sculpture", de: "Meerjungfrauen-Skulptur", es: "Escultura de sirena",     da: "Havfrue-skulptur",        fr: "Sculpture de sirène",     nl: "Zeemeerminbeeldhouwwerk"} },
    { identifier: "stone_arch",        price:    28, pricetype: 2, popularity: 275, texts: { en: "Stone Arch",        de: "Steinbogen",              es: "Arco de piedra",          da: "Stenbue",                 fr: "Arc de pierre",           nl: "Stenen boog"            } },
    { identifier: "island",            price:    34, pricetype: 2, popularity: 340, texts: { en: "Island",            de: "Insel",                   es: "Isla",                    da: "Ø",                       fr: "Île",                     nl: "Eiland"                 } },
    { identifier: "reeds",             price:  3750, pricetype: 1, popularity: 150, texts: { en: "Reeds",             de: "Schilf",                  es: "Cañas",                   da: "Rør",                     fr: "Roseaux",                 nl: "Riet"                   } },
    { identifier: "round_rocks",       price:    20, pricetype: 2, popularity: 200, texts: { en: "Round Rocks",       de: "Runde Steine",            es: "Rocas redondas",          da: "Runde sten",              fr: "Rochers ronds",           nl: "Ronde stenen"           } },
    { identifier: "treasure_chest",    price:    28, pricetype: 2, popularity: 275, texts: { en: "Treasure Chest",    de: "Schatztruhe",             es: "Cofre del tesoro",        da: "Skattekiste",             fr: "Coffre au trésor",        nl: "Schatkist"              } },
    { identifier: "flower_rock",       price:    30, pricetype: 2, popularity: 300, texts: { en: "Flower Rock",       de: "Blumenfels",              es: "Roca floral",             da: "Blomsterklippe",          fr: "Rocher floral",           nl: "Bloemenrots"            } },
    { identifier: "info_board_water",  price:    18, pricetype: 2, popularity: 180, texts: { en: "Info Board (Water)", de: "Infotafel (Wasser)",      es: "Panel informativo (Agua)", da: "Infotavle (Vand)",       fr: "Panneau (Eau)",           nl: "Infobord (Water)"       } },
  ],
  leafy_thicket: [
    { identifier: "rock",       price: 2250, pricetype: 1, popularity: 45, texts: { en: "Rock",       de: "Stein",                   es: "Roca",                    da: "Sten",                    fr: "Rocher",                  nl: "Steen"                  } },
    { identifier: "tree_trunk", price: 3750, pricetype: 1, popularity: 75, texts: { en: "Tree Trunk", de: "Baumstamm",               es: "Tronco de árbol",         da: "Træstamme",               fr: "Tronc d'arbre",           nl: "Boomstam"               } },
    { identifier: "sword",      price:    3, pricetype: 2, popularity: 65, texts: { en: "Sword",      de: "Schwert",                 es: "Espada",                  da: "Sværd",                   fr: "Épée",                    nl: "Zwaard"                 } },
    { identifier: "pennywort",  price:    4, pricetype: 2, popularity: 80, texts: { en: "Pennywort",  de: "Wassernabel",             es: "Ombligo de Venus",        da: "Navleurt",                fr: "Hydrocotyle",             nl: "Waternavel"             } },
  ],
  rocky_desert: [
    { identifier: "green_succulents",    price: 1500, pricetype: 1, popularity: 30, texts: { en: "Green Succulents",    de: "Grüne Sukkulenten",       es: "Suculentas verdes",       da: "Grønne sukkulenter",      fr: "Succulentes vertes",      nl: "Groene succulenten"     } },
    { identifier: "branch",             price:    3, pricetype: 2, popularity: 50, texts: { en: "Branch",             de: "Ast",                     es: "Rama",                    da: "Gren",                    fr: "Branche",                 nl: "Tak"                    } },
    { identifier: "flat_rock",          price: 3750, pricetype: 1, popularity: 75, texts: { en: "Flat Rock",          de: "Flacher Stein",           es: "Roca plana",              da: "Flad sten",               fr: "Roche plate",             nl: "Platte steen"           } },
    { identifier: "red_succulents",     price:    2, pricetype: 2, popularity: 40, texts: { en: "Red Succulents",     de: "Rote Sukkulenten",        es: "Suculentas rojas",        da: "Røde sukkulenter",        fr: "Succulentes rouges",      nl: "Rode succulenten"       } },
    { identifier: "striped_succulents", price:    3, pricetype: 2, popularity: 50, texts: { en: "Striped Succulents", de: "Gestreifte Sukkulenten",  es: "Suculentas rayadas",      da: "Stribede sukkulenter",    fr: "Succulentes rayées",      nl: "Gestreepte succulenten" } },
    { identifier: "tall_rock",          price:    4, pricetype: 2, popularity: 80, texts: { en: "Tall Rock",          de: "Hoher Stein",             es: "Roca alta",               da: "Høj sten",                fr: "Grande roche",            nl: "Hoge steen"             } },
  ],
  freshwater: [
    { identifier: "flat_dragon_stones", price:  3250, pricetype: 1, popularity: 130, texts: { en: "Flat Dragon Stones", de: "Flache Drachensteine",    es: "Piedras dragón planas",   da: "Flade dragesteene",       fr: "Pierres dragon plates",   nl: "Platte draakstenen"     } },
    { identifier: "tall_dragon_stones", price:    13, pricetype: 2, popularity: 130, texts: { en: "Tall Dragon Stones", de: "Hohe Drachensteine",      es: "Piedras dragón altas",    da: "Høje dragesteene",        fr: "Grandes pierres dragon",  nl: "Hoge draakstenen"       } },
    { identifier: "antique_stone",      price: 12500, pricetype: 1, popularity: 500, texts: { en: "Antique Stone",      de: "Antikstein",              es: "Piedra antigua",          da: "Antik sten",              fr: "Pierre antique",          nl: "Antieke steen"          } },
    { identifier: "river_wood",         price:  5000, pricetype: 1, popularity: 200, texts: { en: "River Wood",         de: "Flussholz",               es: "Madera de río",           da: "Flodetræ",                fr: "Bois de rivière",         nl: "Rivierhouttronk"        } },
    { identifier: "java_fern",          price:     5, pricetype: 2, popularity:  50, texts: { en: "Java Fern",          de: "Javafarn",                es: "Helecho de Java",         da: "Java bregne",             fr: "Fougère de Java",         nl: "Java varen"             } },
    { identifier: "pink_parrot_leaf",   price:     8, pricetype: 2, popularity:  80, texts: { en: "Pink Parrot Leaf",   de: "Rosa Papageiblatt",       es: "Hoja de loro rosa",       da: "Lyserødt papegøjeblad",   fr: "Feuille de perroquet rose",nl: "Roze papegaaienblad"    } },
    { identifier: "green_parrot_leaf",  price:     6, pricetype: 2, popularity:  60, texts: { en: "Green Parrot Leaf",  de: "Grünes Papageiblatt",     es: "Hoja de loro verde",      da: "Grønt papegøjeblad",      fr: "Feuille de perroquet vert",nl: "Groen papegaaienblad"   } },
  ],
  saltwater: [
    { identifier: "fire_coral",             price: 2250, pricetype: 1, popularity:  90, texts: { en: "Fire Coral",             de: "Feuerkoralle",            es: "Coral de fuego",          da: "Ildkoral",                fr: "Corail de feu",           nl: "Vuurkoraal"             } },
    { identifier: "blue_cauliflower_coral", price: 1500, pricetype: 1, popularity:  20, texts: { en: "Blue Cauliflower Coral", de: "Blaue Blumenkohlkoralle", es: "Coral coliflor azul",     da: "Blå blomkålskoral",       fr: "Corail choufleur bleu",   nl: "Blauwe bloemkoolkoraal" } },
    { identifier: "anchor",                 price:    5, pricetype: 2, popularity:  50, texts: { en: "Anchor",                 de: "Anker",                   es: "Ancla",                   da: "Anker",                   fr: "Ancre",                   nl: "Anker"                  } },
    { identifier: "pink_cauliflower_coral", price:    2, pricetype: 2, popularity:  50, texts: { en: "Pink Cauliflower Coral", de: "Rosa Blumenkohlkoralle",  es: "Coral coliflor rosa",     da: "Lyserød blomkålskoral",   fr: "Corail choufleur rose",   nl: "Roze bloemkoolkoraal"   } },
    { identifier: "oarweed",                price: 5000, pricetype: 1, popularity: 200, texts: { en: "Oarweed",                de: "Blatttang",               es: "Alga remo",               da: "Bændeltang",              fr: "Laminaire",               nl: "Rietwier"               } },
    { identifier: "tiki_statue",            price:    3, pricetype: 2, popularity:  30, texts: { en: "Tiki Statue",            de: "Tiki-Statue",             es: "Estatua tiki",            da: "Tiki-statue",             fr: "Statue tiki",             nl: "Tiki standbeeld"        } },
  ],
  nocturnal: [
    { identifier: "branch",          price:    2, pricetype: 2, popularity:  20, texts: { en: "Branch",          de: "Ast",                     es: "Rama",                    da: "Gren",                    fr: "Branche",                 nl: "Tak"                    } },
    { identifier: "grass_patch",     price: 1000, pricetype: 1, popularity:  40, texts: { en: "Grass Patch",     de: "Grasfleck",               es: "Parche de hierba",        da: "Græsplet",                fr: "Patch d'herbe",           nl: "Grasplek"               } },
    { identifier: "rocks",          price:    3, pricetype: 2, popularity:  30, texts: { en: "Rocks",          de: "Felsen",                  es: "Rocas",                   da: "Klipper",                 fr: "Rochers",                 nl: "Rotsen"                 } },
    { identifier: "sandhill",       price: 1500, pricetype: 1, popularity:  60, texts: { en: "Sandhill",       de: "Sandhügel",               es: "Montículo de arena",      da: "Sandbakke",               fr: "Dune de sable",           nl: "Zandheuvel"             } },
    { identifier: "plastic_plant",  price:    5, pricetype: 2, popularity:  50, texts: { en: "Plastic Plant",  de: "Kunstpflanze",            es: "Planta de plástico",      da: "Plastikplante",           fr: "Plante plastique",        nl: "Kunstplant"             } },
    { identifier: "flower",         price:   15, pricetype: 2, popularity: 150, texts: { en: "Flower",         de: "Blume",                   es: "Flor",                    da: "Blomst",                  fr: "Fleur",                   nl: "Bloem"                  } },
    { identifier: "tall_grass",     price:  750, pricetype: 1, popularity:  30, texts: { en: "Tall Grass",     de: "Hohes Gras",              es: "Hierba alta",             da: "Højt græs",               fr: "Grande herbe",            nl: "Hoog gras"              } },
    { identifier: "mushroom_stump", price: 4500, pricetype: 1, popularity: 180, texts: { en: "Mushroom Stump", de: "Pilzstumpf",              es: "Tocón de hongo",          da: "Svampestub",              fr: "Souche champignon",       nl: "Paddenstoelstronk"      } },
  ],
  aviary: [
    { identifier: "bamboo",               price:    9, pricetype: 2, popularity:  90, texts: { en: "Bamboo",               de: "Bambus",                  es: "Bambú",                   da: "Bambus",                  fr: "Bambou",                  nl: "Bamboe"                 } },
    { identifier: "small_rocks",          price: 1000, pricetype: 1, popularity:  40, texts: { en: "Small Rocks",          de: "Kleine Steine",           es: "Rocas pequeñas",          da: "Små sten",                fr: "Petites roches",          nl: "Kleine stenen"          } },
    { identifier: "reeds",               price: 4000, pricetype: 1, popularity: 160, texts: { en: "Reeds",               de: "Schilf",                  es: "Cañas",                   da: "Rør",                     fr: "Roseaux",                 nl: "Riet"                   } },
    { identifier: "sand_bath",           price:    8, pricetype: 2, popularity:  80, texts: { en: "Sand Bath",           de: "Sandbad",                 es: "Baño de arena",           da: "Sandbad",                 fr: "Bain de sable",           nl: "Zandbad"                } },
    { identifier: "leopard_lily",        price: 7000, pricetype: 1, popularity: 280, texts: { en: "Leopard Lily",        de: "Leopardenlilie",          es: "Lirio leopardo",          da: "Leopardlilje",            fr: "Lys léopard",             nl: "Luipaardlelie"          } },
    { identifier: "large_rocks",         price:    4, pricetype: 2, popularity:  40, texts: { en: "Large Rocks",         de: "Große Steine",            es: "Rocas grandes",           da: "Store sten",              fr: "Grandes roches",          nl: "Grote stenen"           } },
    { identifier: "water_fountain",      price:   10, pricetype: 2, popularity: 100, texts: { en: "Water Fountain",      de: "Wasserfontäne",           es: "Fuente de agua",          da: "Vandfontæne",             fr: "Fontaine d'eau",          nl: "Waterfontein"           } },
    { identifier: "foraging_play_tree",  price:10000, pricetype: 1, popularity: 400, texts: { en: "Foraging Play Tree",  de: "Futtersuche-Spielbaum",   es: "Árbol de forrajeo",       da: "Fouragering legetræ",     fr: "Arbre de fourrage",       nl: "Foerageer speelboom"    } },
  ],
  rescue: [
    { identifier: "chamomile",           price: 5000, pricetype: 1, popularity: 200, texts: { en: "Chamomile",           de: "Kamille",                 es: "Manzanilla",              da: "Kamille",                 fr: "Camomille",               nl: "Kamille"                } },
    { identifier: "ginseng",             price: 6000, pricetype: 1, popularity: 240, texts: { en: "Ginseng",             de: "Ginseng",                 es: "Ginseng",                 da: "Ginseng",                 fr: "Ginseng",                 nl: "Ginseng"                } },
    { identifier: "pink_lavender",       price: 7000, pricetype: 1, popularity: 280, texts: { en: "Pink Lavender",       de: "Rosa Lavendel",           es: "Lavanda rosa",            da: "Lyserød lavendel",        fr: "Lavande rose",            nl: "Roze lavendel"          } },
    { identifier: "purple_lavender",     price:   10, pricetype: 2, popularity: 100, texts: { en: "Purple Lavender",     de: "Lila Lavendel",           es: "Lavanda morada",          da: "Lilla lavendel",          fr: "Lavande violette",        nl: "Paarse lavendel"        } },
    { identifier: "small_pebble_tower",  price: 8000, pricetype: 1, popularity: 320, texts: { en: "Small Pebble Tower",  de: "Kleiner Kieselturm",      es: "Torre pequeña de guijarros",da: "Lille kieseltårn",       fr: "Petite tour de galets",   nl: "Kleine kiezeltoren"     } },
    { identifier: "tall_pebble_tower",   price:    5, pricetype: 2, popularity:  50, texts: { en: "Tall Pebble Tower",   de: "Hoher Kieselturm",        es: "Torre alta de guijarros", da: "Høj kieseltårn",          fr: "Grande tour de galets",   nl: "Hoge kiezeltoren"       } },
    { identifier: "bamboo_pond",         price:   25, pricetype: 2, popularity: 250, texts: { en: "Bamboo Pond",         de: "Bambussee",               es: "Estanque de bambú",       da: "Bambus dam",              fr: "Étang de bambou",         nl: "Bamboe vijver"          } },
    { identifier: "large_stone_lantern", price:   15, pricetype: 2, popularity: 150, texts: { en: "Large Stone Lantern", de: "Große Steinlaterne",      es: "Linterna de piedra grande",da: "Stor stenlygte",         fr: "Grande lanterne en pierre",nl: "Grote stenen lantaarn"  } },
    { identifier: "small_stone_lantern", price: 9000, pricetype: 1, popularity: 360, texts: { en: "Small Stone Lantern", de: "Kleine Steinlaterne",     es: "Linterna de piedra pequeña",da: "Lille stenlygte",       fr: "Petite lanterne en pierre",nl: "Kleine stenen lantaarn" } },
  ],
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  const allBiomes = await prisma.biome.findMany({ select: { id: true, identifier: true } });
  const biomeIds: Record<string, number> = {};
  for (const b of allBiomes) biomeIds[b.identifier] = b.id;

  const resolve = (identifier: string) => {
    const id = biomeIds[identifier];
    if (!id) console.warn(`  ⚠ Biome not found: ${identifier}`);
    return id;
  };

  const langs = ["en", "de", "es", "da", "fr", "nl"] as const;
  const textEntries = (t: Texts) => langs.map((lc) => ({ languageCode: lc, name: t[lc] }));

  // ── Shelter levels ──────────────────────────────────────────────────────────
  console.log("\n── Shelter levels ──");
  for (const [identifier, levels] of Object.entries(shelterData)) {
    const biomeId = resolve(identifier);
    if (!biomeId) continue;
    for (const lvl of levels) {
      await prisma.biomeShelter.create({ data: { biomeId, ...lvl } });
    }
    console.log(`  ${identifier}: ${levels.length} levels`);
  }

  // ── Troughs ─────────────────────────────────────────────────────────────────
  console.log("\n── Troughs ──");
  for (const [identifier, data] of Object.entries(troughData)) {
    const biomeId = resolve(identifier);
    if (!biomeId) continue;
    await prisma.biomeTrough.create({ data: { biomeId, ...data } });
    console.log(`  ${identifier}`);
  }

  // ── Water holes ─────────────────────────────────────────────────────────────
  console.log("\n── Water holes ──");
  for (const [identifier, data] of Object.entries(waterHoleData)) {
    const biomeId = resolve(identifier);
    if (!biomeId) continue;
    await prisma.biomeWaterHole.create({ data: { biomeId, ...data } });
    console.log(`  ${identifier}`);
  }

  // ── Games ────────────────────────────────────────────────────────────────────
  console.log("\n── Games ──");
  for (const [identifier, games] of Object.entries(gameData)) {
    const biomeId = resolve(identifier);
    if (!biomeId) continue;
    for (const g of games) {
      await prisma.biomeGame.create({
        data: {
          biomeId,
          identifier: g.identifier,
          price: g.price,
          pricetype: g.pricetype,
          repair: g.repair,
          texts: { createMany: { data: textEntries(g.texts) } },
        },
      });
    }
    console.log(`  ${identifier}: ${games.length} games`);
  }

  // ── Decorations ──────────────────────────────────────────────────────────────
  console.log("\n── Decorations ──");
  for (const [identifier, decos] of Object.entries(decorationData)) {
    const biomeId = resolve(identifier);
    if (!biomeId) continue;
    for (const d of decos) {
      await prisma.biomeDecoration.create({
        data: {
          biomeId,
          identifier: d.identifier,
          price: d.price,
          pricetype: d.pricetype,
          popularity: d.popularity,
          texts: { createMany: { data: textEntries(d.texts) } },
        },
      });
    }
    console.log(`  ${identifier}: ${decos.length} decos × 6 Sprachen`);
  }

  console.log("\n✅ Done");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
