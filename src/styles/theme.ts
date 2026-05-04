import { Sedgwick_Ave_Display, DM_Sans, Playfair_Display } from "next/font/google";

const sedgwick = Sedgwick_Ave_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const theme = {
  colors: {
    // Deine Haupt-Farbgruppe (Petrol/Grün Mix)
    primary: {
      50: "#d1e8e2", // petrolLight
      100: "#a3cfbb", // greenLight
      500: "#0e7a4a", // petrol (Hauptfarbe)
      600: "#056d42", // petrolDark
      700: "#1a4332", // petrolGreenDark
      800: "#004d4d", // petrolDarker
      900: "#2d5a27", // greenDark
    },
    // Akzent-Farben (Orange/Gelb für Buttons & Highlights)
    accent: {
      light: "#DAE67F", // yellowLight
      main: "#FF8C00", // oranget
      hover: "rgba(255, 165, 0, 1)", // orangeLight
      warm: "#fceabb", // warmWhite
    },
    // Systemfarben (Zusatzfarben für Biome oder Status)
    system: {
      success: "#68B300", // green
      successLight: "#8dbd5b", // greenLighter
      info: "#1d4ed8", // blue
      lime: "#d6efc0",
      honeydew: "#e8f5d7",
    },
    // UI Elemente & Overlays
    ui: {
      white: "#ffffff",
      whiteSoft: "#f0f4eb", // whiteLight
      bodyBg: "#c4f3fb",
      textMain: "#2c3531",
      border: "#d1e8e2",
      icon: "#68B300",
      pageBg: "#d6efc0", //lime

      // Transparente Layer (Glas-Effekte)
      glassWhite: "rgba(255, 255, 255, 0.3)", // grey
      glassWhiteRich: "rgba(255, 255, 255, 0.4)", // greyLight
      overlayDark: "rgba(0, 0, 0, 0.2)", // black
      overlayLight: "rgba(0, 0, 0, 0.05)", // dropdownLink
    },
    header: {
      bg: "#ffaf4a",
      dropdownLink: "rgba(0, 0, 0, 0.05)",
      avatartooltip: "#68B300",
    },
    main: {
      title: "#68B300",
    },
  },
  shadows: {
    soft: "0 8px 32px rgba(0, 0, 0, 0.2)",
    headerButton: "0 2px 8px rgba(255, 140, 0, 0.3)",
    headerButtonHover: "0 4px 12px rgba(255, 140, 0, 0.5)",
  },
  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1280px",
  },
  fonts: {
    club: sedgwick.style.fontFamily,
    text: dmSans.style.fontFamily,
    heading: playfair.style.fontFamily,
    comic: '"Comic Sans MS", "Chalkboard SE", cursive',
  },
  borderRadius: {
    main: "20px",
    icon: "10px",
    full: "9999px",
  },
  glass: {
    blur: "blur(10px)",
    border: "1px solid rgba(120, 255, 120, 0.15)",
  },
  button: {
    confirm: "#d33",
    cancel: "#3085d6",
  },
  layout: {
    widthPage: "1200px",
  },
  spacing: (n: number) => `${n * 8}px`,
};

export type ThemeType = typeof theme;
