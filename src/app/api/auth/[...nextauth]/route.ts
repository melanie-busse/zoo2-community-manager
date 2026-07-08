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
          id: profile.id,
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
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            roleId: 1,
          },
        });
        return true;
      } catch (error) {
        console.error("Datenbank-Fehler beim Login:", error);
        return true;
      }
    },

    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      try {
        const userId = token?.id || session?.user?.id;

        if (!userId) {
          console.warn("Session Callback: Keine User-ID im Token gefunden.");
          return session;
        }

        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            role: true,
          },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.roleId = dbUser.roleId;
          session.user.role = dbUser.role?.name || "User";
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
