import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import StyledComponentsRegistry from "@/lib/registry";
import React from "react";

import Providers from "@/components/Providers";
import Header from "@/components/page-structure/Header/Header";
import Main from "@/components/page-structure/Main/Main";
import Footer from "@/components/page-structure/Footer/Footer";
import ScrollToTopBadge from "@/components/ui/badges/ScrollToTopBadge";

export const metadata: Metadata = {
  title: "Zoo 2: Animal Park Manager",
  description: "The ultimate community and management tool for your zoo.",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <StyledComponentsRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <Header />
              <Main>{children}</Main>
              <Footer />
              <ScrollToTopBadge />
            </Providers>
          </NextIntlClientProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
