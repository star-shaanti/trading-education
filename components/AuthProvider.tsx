"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

/**
 * Fournit la session NextAuth à toute l'application.
 *
 * - `session` est fournie **par le serveur** (layout) : l'en-tête affiche donc
 *   le bon état dès le HTML initial (pas de bouton « Connexion » fantôme pour un
 *   membre déjà connecté) ;
 * - `useSession()` se met ensuite à jour **automatiquement** après connexion /
 *   déconnexion — l'ancien `fetch("/api/auth/session")` au montage, dans un
 *   en-tête qui n'est pas remonté lors d'une navigation côté client, laissait le
 *   bouton « Connexion » affiché après s'être connecté.
 */
export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
