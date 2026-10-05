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
      { labelKey: "statistic", href: "/zoo/statistic", requiresAuth: false },
      { labelKey: "regions", href: "/zoo/regions", requiresAuth: false },
      {
        labelKey: "region_create",
        href: "/zoo/regions/create",
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
    ],
  },

  {
    id: "admin",
    labelKey: "admin",
    basePath: "/admin",
    requiresAuth: true,
    minimumRole: "Director",
    subMenu: [{ labelKey: "import-animals", href: "/admin/import-animals", requiresAuth: true }],
  },
];
