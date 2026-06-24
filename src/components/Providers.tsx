"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "flag-icons/css/flag-icons.min.css";

import { theme } from "@/styles/theme";
import { GlobalStyles } from "@/styles/GlobalStyles";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
          style={{ zIndex: 99999 }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
