import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Matcht alle Pfade, außer API-Routen, statische Dateien etc.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
