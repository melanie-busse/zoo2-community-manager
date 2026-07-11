export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

const discordId = process.env.DISCORD_CLIENT_ID;
const discordSecret = process.env.DISCORD_CLIENT_SECRET;

if (!discordId || !discordSecret) {
  throw new Error("Missing Discord environment variables in .env!");
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

    CredentialsProvider({
      id: "mayor-login",
      name: "Mayor",
      credentials: {},
      async authorize() {
        const mayorUser = await prisma.user.findFirst({
          where: { roleId: 0 },
        });

        if (mayorUser) {
          return {
            id: mayorUser.id.toString(),
            name: mayorUser.name,
            email: mayorUser.email,
            image: "/images/user/mayor-avatar.png",
            isMayor: true,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === "mayor-login") {
        return true;
      }

      try {
        await prisma.user.upsert({
          where: { discordId: user.id },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            discordId: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            roleId: 5,
          },
        });
        return true;
      } catch (error) {
        console.error("[AUTH] Database error during signIn:", error);
        return true;
      }
    },

    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      if (user) {
        if (user.isMayor || account?.provider === "mayor-login") {
          token.id = user.id;
          token.isMayor = true;
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { discordId: user.id },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.isMayor = false;
          }
        }
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      try {
        const userId = token?.id;

        if (!userId) {
          console.warn("[AUTH] Session Callback: No user ID found in token.");
          return session;
        }

        let dbUser = null;

        if (token.isMayor) {
          dbUser = await prisma.user.findFirst({
            where: { roleId: 0 },
          });
        } else {

          dbUser = await prisma.user.findUnique({
            where: { id: Number(userId) },

          });
        }

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
        console.error("[AUTH] CRITICAL ERROR IN SESSION CALLBACK:", error);
        return session;
      }
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
