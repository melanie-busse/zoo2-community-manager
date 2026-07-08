export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "@/lib/prisma";

const discordId = process.env.DISCORD_CLIENT_ID;
const discordSecret = process.env.DISCORD_CLIENT_SECRET;

if (!discordId || !discordSecret) {
  throw new Error("Fehlende Discord Umgebungsvariablen in der .env!");
}

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: discordId,
      clientSecret: discordSecret,
      profile(profile) {
        return {
          id: profile.id, // Das ist die Discord-ID (String)
          name: profile.global_name || profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      try {
        // Wir upserten anhand der UNIQUE discordId
        await prisma.user.upsert({
          where: { discordId: user.id },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            discordId: user.id, // Hier landet die lange Discord-ID
            name: user.name,
            email: user.email,
            image: user.image,
            roleId: 5, // Standard: Visitor
          },
        });
        return true;
      } catch (error) {
        console.error("Datenbank-Fehler beim Login:", error);
        return true;
      }
    },

    async jwt({ token, user }: { token: any; user: any }) {
      // Wenn der User sich frisch einloggt, holen wir seine interne DB-ID
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { discordId: user.id },
        });
        if (dbUser) {
          token.id = dbUser.id; // Wir packen die INTERNE Int-ID in den Token
        }
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      try {
        const userId = token?.id;

        if (!userId) {
          console.warn("Session Callback: Keine User-ID im Token gefunden.");
          return session;
        }

        // Wir suchen ganz entspannt mit der internen Int-ID (Zahl)
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.roleId = dbUser.roleId;

          const dbRole = await prisma.role.findUnique({
            where: { id: dbUser.roleId },
          });

          session.user.role = dbRole?.name || "Visitor";
        }

        return session;
      } catch (error) {
        console.error("KRITISCHER FEHLER IM SESSION CALLBACK:", error);
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
