import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react"; // <-- Import hinzugefügt
import { theme } from "@/styles/theme";

const messages = {
  Header: {
    Title: "Community Manager",
    Login: {
      open_menu: "Menü öffnen",
      logout: "Logout",
      button: "Login",
      welcome: "Willkommen",

      profile: "Profil",
      settings: "Einstellungen",
    },
    Navigation: {
      home: "Home",
      admin: "Admin",
      animals: "Tiere",
      animal_overview: "Tierübersicht",
      club: "Club",
      club_statues: "Clubstatuen",
      create_animal: "Tier anlegen",
    },
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
