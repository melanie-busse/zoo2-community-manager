interface SubMenuItem {
  labelKey: string;
  href: string;
  requiresAuth?: boolean;
  minimumRole?: "Visitor" | "Member" | "Employee" | "Director" | "Admin";
}

interface NavItem {
  id: string;
  labelKey: string;
  href?: string; // Für einfache Links wie "Home"
  basePath?: string; // Für Dropdowns, um den "Aktiv"-Status zu prüfen
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
      { labelKey: "visitor_faq", href: "/zoo/visitor-faq", requiresAuth: false },
      { labelKey: "statistic", href: "/zoo/statistic", requiresAuth: false },
      { labelKey: "biomes", href: "/zoo/biomes", requiresAuth: false },
      {
        labelKey: "biome_create",
        href: "/zoo/biomes/create",
        requiresAuth: true,
        minimumRole: "Director",
      },
      { labelKey: "regions", href: "/zoo/regions", requiresAuth: false },
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
      { labelKey: "origins", href: "/zoo/origins", requiresAuth: false },
      {
        labelKey: "origin_create",
        href: "/zoo/origins/create",
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
    id: "animals",
    labelKey: "animals",
    basePath: "/animals",
    subMenu: [
      { labelKey: "animal_overview", href: "/animals" },
      {
        labelKey: "animal_create",
        href: "/animals/create",
        requiresAuth: true,
        minimumRole: "Director",
      },
      { labelKey: "specialcoats_overview", href: "/specialcoats" },
      {
        labelKey: "specialcoats_create",
        href: "/specialcoats/create",
        requiresAuth: true,
        minimumRole: "Director",
      },
      {
        labelKey: "collections",
        href: "/animals/collections",
        requiresAuth: false,
      },
      {
        labelKey: "collection_create",
        href: "/animals/collections/create",
        requiresAuth: true,
        minimumRole: "Director",
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
        labelKey: "club_faq",
        href: "/contests/faq",
        requiresAuth: false,
      },
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
      { labelKey: "game_faq", href: "/game/faq", requiresAuth: false },
      { labelKey: "academy_faq", href: "/game/academy-faq", requiresAuth: false },
      { labelKey: "levelup", href: "/game/levelup", requiresAuth: false },
      { labelKey: "mayor_quests", href: "/game/mayor-quests", requiresAuth: false },
    ],
  },
];
