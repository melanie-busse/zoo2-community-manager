export interface SubMenuItem {
  labelKey: string;
  href?: string;
  requiresAuth?: boolean;
  minimumRole?: "Visitor" | "Member" | "Employee" | "Director" | "Admin";
  subMenu?: SubMenuItem[]; // Optional: 3. Ebene
}

export interface NavItem {
  id: string;
  labelKey: string;
  href?: string;
  basePath?: string;
  requiresAuth?: boolean;
  minimumRole?: "Visitor" | "Member" | "Employee" | "Director" | "Admin";
  subMenu?: SubMenuItem[];
}

export const navConfig: NavItem[] = [
  {
    id: "home",
    labelKey: "home",
    href: "/",
  },
  {
    id: "zoo",
    labelKey: "zoo",
    basePath: "/zoo",
    requiresAuth: false,
    subMenu: [
      { labelKey: "statistic", href: "/zoo/statistic", requiresAuth: false },

      {
        labelKey: "biomes",
        subMenu: [
          { labelKey: "biomes_overview", href: "/animals" },
          {
            labelKey: "biome_create",
            href: "/zoo/biomes/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
          { labelKey: "games", href: "/zoo/games", requiresAuth: false },
          {
            labelKey: "game_create",
            href: "/zoo/games/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
          { labelKey: "decorations", href: "/zoo/decorations", requiresAuth: false },
          {
            labelKey: "decoration_create",
            href: "/zoo/decorations/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
        ],
      },

      {
        labelKey: "regions",
        subMenu: [
          { labelKey: "region_overview", href: "/zoo/regions", requiresAuth: false },
          {
            labelKey: "region_create",
            href: "/zoo/regions/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
          { labelKey: "terrains", href: "/zoo/terrains", requiresAuth: false },
          {
            labelKey: "terrain_create",
            href: "/zoo/terrains/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
          { labelKey: "shops", href: "/zoo/shops", requiresAuth: false },
          {
            labelKey: "shop_create",
            href: "/zoo/shops/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
        ],
      },
      {
        labelKey: "origins",
        subMenu: [
          { labelKey: "origin_overview", href: "/zoo/origins", requiresAuth: false },
          {
            labelKey: "origin_create",
            href: "/zoo/origins/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
        ],
      },
    ], // <-- HIER FEHLTE DAS SCHLIESSEN VON zoo.subMenu
  }, // <-- HIER FEHLTE DAS SCHLIESSEN DES zoo-OBJEKTS
  {
    id: "animals",
    labelKey: "animals",
    basePath: "/animals",
    subMenu: [
      {
        labelKey: "animals",
        subMenu: [
          { labelKey: "animal_overview", href: "/animals" },
          {
            labelKey: "animal_create",
            href: "/animals/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
        ],
      },
      {
        labelKey: "specialcoats",
        subMenu: [
          { labelKey: "specialcoats_overview", href: "/specialcoats" },
          {
            labelKey: "specialcoats_create",
            href: "/specialcoats/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
        ],
      },
      {
        labelKey: "collections",
        subMenu: [
          { labelKey: "collections_overview", href: "/animals/collections" },
          {
            labelKey: "collection_create",
            href: "/animals/collections/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
        ],
      },
      { labelKey: "import-animals", href: "/admin/import-animals", requiresAuth: true },
    ],
  },

  {
    id: "contests",
    labelKey: "club",
    basePath: "/contests",
    requiresAuth: false,
    subMenu: [
      {
        labelKey: "club_contests",
        href: "/contests",
        requiresAuth: false,
      },
      {
        labelKey: "club_create_contest",
        href: "/contests/create",
        requiresAuth: true,
        minimumRole: "Employee",
      },
    ],
  },
  {
    id: "inventory",
    labelKey: "inventory",
    basePath: "/zooInventory",
    requiresAuth: true,
    subMenu: [
      {
        labelKey: "inventory_statistic",
        href: "/zooInventory/statistic",
        requiresAuth: true,
      },
      {
        labelKey: "inventory_specialcoats",
        href: "/zooInventory/specialcoats",
        requiresAuth: true,
      },
      {
        labelKey: "inventory_animals",
        href: "/zooInventory/animals",
        requiresAuth: true,
      },
      {
        labelKey: "inventory_statues",
        href: "/zooInventory/statues",
        requiresAuth: true,
      },
      {
        labelKey: "inventory_contest_special_coats",
        href: "/zooInventory/contestSpecialCoats",
        requiresAuth: true,
      },
      {
        labelKey: "inventory_collections",
        href: "/zooInventory/collections",
        requiresAuth: true,
      },
      {
        labelKey: "inventory_regions",
        href: "/zooInventory/regions",
        requiresAuth: true,
      },
      {
        labelKey: "inventory_biomes",
        href: "/zooInventory/biomes",
        requiresAuth: true,
      },
    ],
  },

  {
    id: "game",
    labelKey: "game",
    basePath: "/game",
    requiresAuth: false,
    subMenu: [
      { labelKey: "levelup", href: "/game/levelup", requiresAuth: false },
      { labelKey: "mayor_quests", href: "/game/mayor-quests", requiresAuth: false },
      {
        labelKey: "chests",
        subMenu: [
          { labelKey: "chests_overview", href: "/game/chests", requiresAuth: false },
          {
            labelKey: "chests_create",
            href: "/game/chests/create",
            requiresAuth: true,
            minimumRole: "Director",
          },
        ],
      },
    ],
  },
  {
    id: "wiki",
    labelKey: "wiki",
    basePath: "/wiki",
    requiresAuth: false,
    subMenu: [
      { labelKey: "wiki_game", href: "/wiki/game", requiresAuth: false },
      { labelKey: "faq_academy", href: "/faq/academy", requiresAuth: false },
      { labelKey: "faq_visitor", href: "/faq/visitor", requiresAuth: false },
      { labelKey: "faq_contest", href: "/faq/contest", requiresAuth: false },
      { labelKey: "faq_club", href: "/faq/club", requiresAuth: false },
      { labelKey: "wiki_advent_calendar", href: "/wiki/advent-calendar", requiresAuth: false },
      { labelKey: "wiki_animal_trades", href: "/wiki/animal-package-trades", requiresAuth: false },
      { labelKey: "wiki_breeding", href: "/wiki/breeding", requiresAuth: false },
      { labelKey: "wiki_bulldozer", href: "/wiki/bulldozer", requiresAuth: false },
      { labelKey: "wiki_chests", href: "/wiki/chests", requiresAuth: false },
      { labelKey: "wiki_conservation_week", href: "/wiki/conservation-week", requiresAuth: false },
      { labelKey: "wiki_currency", href: "/wiki/currency", requiresAuth: false },
      { labelKey: "wiki_fashion_boutique", href: "/wiki/fashion-boutique", requiresAuth: false },
      { labelKey: "wiki_friends", href: "/wiki/friends", requiresAuth: false },
      { labelKey: "wiki_ice_cream_vendor", href: "/wiki/ice-cream-vendor", requiresAuth: false },
      { labelKey: "wiki_kujali_park", href: "/wiki/kujali-park", requiresAuth: false },
      { labelKey: "wiki_login_rewards", href: "/wiki/login-rewards", requiresAuth: false },
      { labelKey: "wiki_prize_wheel", href: "/wiki/prize-wheel", requiresAuth: false },
      { labelKey: "wiki_quests", href: "/wiki/quests", requiresAuth: false },
      { labelKey: "wiki_rescue_center", href: "/wiki/rescue-center", requiresAuth: false },
      { labelKey: "wiki_season_pass", href: "/wiki/season-pass", requiresAuth: false },
      { labelKey: "wiki_super_deals", href: "/wiki/super-deals", requiresAuth: false },
      { labelKey: "wiki_vip_animals", href: "/wiki/vip-animals", requiresAuth: false },
      { labelKey: "wiki_collections", href: "/wiki/collections", requiresAuth: false },
      { labelKey: "wiki_diamonds", href: "/wiki/diamonds", requiresAuth: false },
      { labelKey: "wiki_rainforest_park", href: "/wiki/rainforest-park", requiresAuth: false },
      { labelKey: "wiki_video_ads", href: "/wiki/video-ads", requiresAuth: false },
      {
        labelKey: "wiki_season_pass_history",
        href: "/wiki/season-pass-history",
        requiresAuth: false,
      },
      { labelKey: "wiki_sparkling_animals", href: "/wiki/sparkling-animals", requiresAuth: false },
      { labelKey: "wiki_terrain_editor", href: "/wiki/terrain-editor", requiresAuth: false },
    ],
  },
];
