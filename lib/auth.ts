import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";

/**
 * Authentification : NextAuth v4 (JWT) + adaptateur Prisma.
 * - rôles : VISITOR (newsletter), MEMBER (compte gratuit), ADMIN
 * - aucun paiement / aucune donnée bancaire
 * - la session est signée (JWT) : le rôle y est embarqué pour le middleware
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email et mot de passe",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        /**
         * Compte suspendu : la reconnexion **réactive** automatiquement le compte
         * (les préférences d'email restent désactivées : le membre les réactive
         * depuis ses paramètres s'il le souhaite).
         */
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            ...(user.suspendedAt ? { suspendedAt: null } : {}),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          locale: user.locale,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role ?? "MEMBER";
        token.locale = user.locale ?? "fr";
      } else if (token.sub && (!token.role || !token.locale)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, locale: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.locale = dbUser.locale;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid ?? token.sub ?? "";
        session.user.role = (token.role as UserRole) ?? "MEMBER";
        session.user.locale = token.locale ?? "fr";
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.id) {
        await trackEvent({ type: "LOGIN", userId: user.id });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
};

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  /** Locale du compte (emails transactionnels) — "fr" ou "en". */
  locale: string;
};

/**
 * Lit la session **sans jamais faire échouer le rendu**.
 *
 * Si la configuration NextAuth est incomplète (cas typique : `NEXTAUTH_SECRET`
 * absent en production), `getServerSession()` lève une `MissingSecret`. Comme
 * le layout racine lit la session sur **chaque page**, cette exception rendrait
 * tout le site inaccessible (500 « Application error »). On préfère dégrader :
 * les pages publiques s'affichent en visiteur, et l'erreur est journalisée une
 * fois avec la variable à vérifier.
 */
let warnedAboutSessionFailure = false;

export async function safeServerSession(): Promise<Session | null> {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    if (!warnedAboutSessionFailure) {
      warnedAboutSessionFailure = true;
      console.error(
        "[auth] Session illisible — vérifiez NEXTAUTH_SECRET (et NEXTAUTH_URL) dans les variables d'environnement :",
        error instanceof Error ? error.message : error
      );
    }
    return null;
  }
}

/** Utilisateur connecté (Server Components / route handlers). */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await safeServerSession();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
    locale: session.user.locale ?? "fr",
  };
}

/** Contrôle d'accès basé sur les rôles (voir lib/roles.ts pour le détail). */
export { canAccessAdminPath, isAdminRole, isContentRole } from "@/lib/roles";

/** Vérifie que l'utilisateur connecté est administrateur. */
export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

/** Vérifie que l'utilisateur connecté peut gérer les contenus (ADMIN ou EDITOR). */
export async function requireContentManager(): Promise<SessionUser | null> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) return null;
  return user;
}

export function isAdmin(user: { role: UserRole } | null | undefined): boolean {
  return user?.role === "ADMIN";
}

export function isContentManager(user: { role: UserRole } | null | undefined): boolean {
  return user?.role === "ADMIN" || user?.role === "EDITOR";
}
