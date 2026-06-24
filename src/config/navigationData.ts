interface SubMenuItem {
  labelKey: string;
  href: string;
  requiresAuth?: boolean; // Optional: Wenn nicht gesetzt, ist es öffentlich
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
    ],
  },
  {
    id: "contests",
    labelKey: "club",
    basePath: "/contests",
    subMenu: [
      { labelKey: "club_statues", href: "/contests/statues" },
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
];
