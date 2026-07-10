import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react"; // <-- Import hinzugefügt
import { theme } from "@/styles/theme";

const messages = {
  navigation: {
    title: "Community Manager",
    login: {
      open_menu: "Menü öffnen",
      logout: "Logout",
      button: "Login",
      welcome: "Willkommen",
    },
    role: {
      role_admin: "Admin",
      role_Director: "Direktor",
      role_Employee: "Mitarbeiter",
      role_Member: "Mitglied",
      role_Visitor: "Besucher",
      "role_": "Keine Rolle",
    },
    links: {
      home: "Home",
      animals: "Tiere",
      animal_overview: "Tierübersicht",
      animal_create: "Tier anlegen",
      specialCoats: "Farbvarianten",
      specialcoats_overview: "Farbvarianten-Übersicht",
      specialcoats_create: "Farbvariante anlegen",
      club: "Klub",
      club_statues: "Statuen",
      club_contests: "Wettbewerbe",
      club_create_contest: "Wettbewerb anlegen",
    },
  },
  common: {
    buttons: { edit: "Bearbeiten", delete: "Löschen", add: "Hinzufügen" },
    pagination: { prev: "Zurück", next: "Weiter" },
    filter: {
      search_placeholder: "Suche...",
      all_enclosures: "Alle Gehege",
      all_levels: "Alle Levels",
      all_status: "Alle Status",
      status_prefix: "Status:",
      ready: "Fertig",
      missing_partner: "Partner fehlt",
      not_owned: "Nicht besitzt",
      level_label: "Level",
      results: { show: "Angezeigt", of: "von", unit: "Tiere gefunden" },
    },
    messages: {
      no_more_items: "Keine weiteren gefunden",
      none_selected: "Keine ausgewählt",
      yes_delete: "Ja, löschen!",
      cancel: "Abbrechen",
    },
    tooltip: { removeRow: "Zeile entfernen", level: "Level" },
    emptyState: {
      animals: { title: "Oje, kein Tier da!" },
      specialCoats: { title: "Oje, kein Tier da!" },
      uppySad: "Uppy ist traurig",
      message: "Uppy hat überall gesucht.",
      button: "Suche neu starten",
    },
    errors: { imageNotFound: "Bild nicht gefunden" },
    price: "Preis",
    time: "Zeit",
    hours: "Stunden",
    minutes: "Minuten",
    language: "Sprache",
    allLanguages: "Alle Sprachen",
    name: "Name",
    addRow: "+ Zeile hinzufügen",
    selling_price: "Verkaufspreis",
    release: "Release-Datum",
    popularity: "Popularität",
    actions: "Aktionen",
    action: "Aktion",
    scroll_to_top: "Nach oben scrollen",
    saving: "Wird gespeichert...",
    save_changes: "Daten erfolgreich übermittelt!",
    available: "Verfügbar",
    not_found: "Nicht gefunden",
    chosen: "Ausgewählt",
    none_selected: "Keine ausgewählt",
    description: "Beschreibung",
    descriptionPlaceholder: "Hier Beschreibung eingeben...",
    pleaseSelect: "Bitte wählen...",
    loading_data: "Daten werden geladen...",
  },
  animal: {
    species: "Name",
    overview_title: "Übersicht über alle Tiere",
    noName: "Kein Name vorhanden",
    release: "Auswildern",
    colorVariants: "Farbvarianten",
    biomeCapacity: "Gehegekapazität",
    animalCount: "Anzahl Tiere",
    biomeSize: "Gehegegröße",
    capacityTableLabel: "Anzahl Tiere vs. Gehegeplatz",
    requiredSize: "Benötigte Fläche",
    form: { createAnimal: "Neues Tier anlegen", editAnimal: "Tier bearbeiten", saveAnimal: "Tier speichern" },
    breeding: { xpAndActions: "XP und Aktionen", breeding: "Zucht", breedingChance: "Zuchtchance" },
    basicInfoSection: { basicInfo: "Grundinformationen", fields: { releaseDate: "Release" } },
    translationSection: { title: "Übersetzungen", fields: { name: "Name", language: "Sprache", description: "Beschreibung", descriptionPlaceholder: "Beschreibe das Tier..." } },
    priceSection: { pricesAndValues: "Preise und Werte" },
    xpSection: { actionsXp: "Aktionen & EP" },
    originSection: { originTitle: "Herkunft", originDescription: "Woher bekommt man dieses Tier?" },
    actions: { feed: "Füttern", play: "Spielen", clean: "Säubern" },
    messages: { createSuccess: "Tier angelegt!", deleteSuccess: "Tier gelöscht!", editSuccess: "Änderungen gespeichert!", deleteError: "Fehler beim Löschen.", deleteErrorTitle: "Tier löschen?", confirmDelete: "Wirklich löschen?" },
    emptyState: { title: "Oje, kein Tier da!" },
  },
  biome: {
    enclosure: "Gehege",
    enclosureType: "Gehegetyp",
    shelterLevel: "Stall Level",
    noBiome: "Kein Gehege",
  },
  specialCoat: {
    overview_title: "Farbvarianten",
    species: "Name",
    color: "Farbe",
    noName: "Kein Name vorhanden",
    noColor: "Keine Farbe vorhanden",
    form: { createSpecialCoat: "Farbvariante erstellen", editSpecialCoat: "Farbvariante editieren", saveSpecialCoat: "Speichern", translationSection: { title: "Übersetzungen", fields: { language: "Sprache", name: "Variantenname", NamePlaceholder: "z.B. Halloween", color: "Farbe", ColorPlaceholder: "z.B. gestreift" } } },
    messages: { deleteErrorTitle: "Farbvariante löschen?", confirmDelete: "Wirklich löschen?", deleteSuccess: "Farbvariante gelöscht" },
    emptyState: { title: "Oje, kein Tier da!" },
  },
  contest: {
    emptyState: { title: "Keine Wettbewerbe gefunden" },
    status: { running: "Läuft gerade", upcoming: "Demnächst" },
  },
  page: {
    home: { stats: { animals: "Tiere", specialCoat: "Farbvarianten", biomes: "Gehege", regions: "Zooregionen" }, cards: { lexicon: { title: "Tier-Lexikon", text: "..." }, specialCoat: { title: "Farbvarianten", text: "..." }, club: { title: "Klub", text: "..." } } },
    footer: { imprint: "Impressum" },
  },
};

const AllTheProviders = ({
  children,
  session = null,
}: {
  children: React.ReactNode;
  session?: any;
}) => {
  return (
    <ThemeProvider theme={theme}>
      <NextIntlClientProvider locale="de" messages={messages}>
        <SessionProvider session={session}>
          {" "}
          {/* <-- Provider hinzugefügt */}
          {children}
        </SessionProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { session?: any },
) => {
  const { session, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} session={session} />,
    ...renderOptions,
  });
};

export * from "@testing-library/react";
export { customRender as render };
