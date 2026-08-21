interface SubMenuItem {
  labelKey: string;
  href: string;
  requiresAuth?: boolean;
}

interface NavItem {
  id: string;
  labelKey: string;
  href?: string; // Für einfache Links wie "Home"
  basePath?: string; // Für Dropdowns, um den "Aktiv"-Status zu prüfen
  requiresAuth?: boolean;
  subMenu?: SubMenuItem[];
}

export const navConfig: NavItem[] = [
  {
    id: "home",
    labelKey: "home",
    href: "/",
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
      },
      { labelKey: "specialcoats_overview", href: "/specialcoats" },
      {
        labelKey: "specialcoats_create",
        href: "/specialcoats/create",
        requiresAuth: true,
      },
    ],
  },
  {
    id: "contests",
    labelKey: "club",
    basePath: "/contests",
    requiresAuth: true,
    subMenu: [
      {
        labelKey: "club_contests",
        href: "/contests",
        requiresAuth: true,
      },
      {
        labelKey: "club_create_contest",
        href: "/contests/create",
        requiresAuth: true,
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
    ],
  },

  {
    id: "admin",
    labelKey: "admin",
    basePath: "/admin",
    requiresAuth: true,
    subMenu: [{ labelKey: "import-animals", href: "/admin/import-animals", requiresAuth: true }],
  },
];
