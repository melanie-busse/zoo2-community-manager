# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Zoo 2: Animal Park Community Manager** — A web app for the "Zoo 2: Animal Park" game community. It manages game data (animals, special coats, biomes, statues, members) and helps club members plan competitions.

## Commands

```bash
npm run dev         # Start development server
npm run build       # Generate Prisma client + build for production
npm run start       # Run production server
npm run lint        # ESLint
npm run test        # Run Vitest (watch mode)
npx vitest run      # Run tests once (CI mode)
npx vitest run src/store/useAnimalStore.test.ts  # Run a single test file
npx prisma migrate dev   # Apply DB migrations
npx prisma studio        # Open Prisma visual DB editor
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router, React 19, TypeScript 5
- **Prisma 6** + MySQL/MariaDB
- **NextAuth.js** — Discord OAuth, role stored in DB
- **next-intl** — URL-based i18n (`/de/...`, `/en/...`), default locale: `de`
- **Zustand** — client-side state (filters, sort, pagination)
- **Styled Components** — CSS-in-JS with global theme
- **Vitest** + React Testing Library

### Key Patterns

**Server/Client split:** Page components are Server Components that fetch data via service functions (marked `"use server"`/`"use server only"`). Data is passed down to `*Client.tsx` components or `*OverviewContent.tsx` components marked `"use client"`.

**Data flow for list pages:**
```
page.tsx (SSR, fetches data via Service)
  → *OverviewContent.tsx (client, Zustand store)
    → filters/sort/paginate via *Util.ts
    → renders *DesktopTable.tsx + *MobileCard.tsx
```

**Service layer** (`src/service/`) — All Prisma queries live here. Services are imported directly in server components/API routes.

**API routes** (`src/app/api/`) — RESTful endpoints at `/api/{resource}/[id]/route.ts`. Handle GET/POST/PUT/DELETE, accept `locale` param for translated responses.

**Zustand stores** (`src/store/`) — Hold filter, sort, and pagination state for overview pages. Pattern: store holds state + action methods; `*Util.ts` contains pure filter/sort/paginate functions tested in isolation.

**Frontend services** (`src/service/frontend/`) — Client-side fetch wrappers that call the API routes (used in forms and store actions).

## Constraints & Rules
- **Never do:** Do not install any new npm packages or dependencies without asking for explicit permission first.
- **Convention:** Always use functional components with Styled Components for styling; do not mix in atomic CSS frameworks like Tailwind.

### i18n
- Message files in `/messages/{locale}.json`
- Server: `getTranslations('namespace')`
- Client: `useTranslations('namespace')`
- Add new keys to all locale files when adding UI text

### Styling
- Theme defined in `src/styles/theme.ts` — use `theme.spacing(n)` (= `n * 8px`), colors, and breakpoints
- Glass morphism and shadow effects are in the theme
- Breakpoints: mobile `768px`, tablet `1024px`, desktop `1280px`

### Authentication
- Discord OAuth via NextAuth; session includes `user.role` and `user.roleId`
- Protected routes marked `requiresAuth: true` in `src/config/navigationData.ts`

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=mysql://user:pass@host:3306/zoo2-community-manager
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
```