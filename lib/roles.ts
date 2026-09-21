import type { UserRole } from "@prisma/client";

/**
 * Politique d'accès aux sections de l'administration.
 * Module volontairement sans dépendance runtime (Prisma, bcrypt…) afin de
 * pouvoir être importé par le middleware (Edge runtime).
 */

/** Sections réservées au rôle ADMIN (données personnelles, campagnes email). */
export const ADMIN_ONLY_SECTIONS = ["abonnes", "emails"] as const;

/** Sections ouvertes aux rédacteurs (EDITOR) : contenus + modération. */
export const CONTENT_SECTIONS = ["", "articles", "rapports", "webinaires", "commentaires"] as const;

export function isAdminRole(role?: UserRole | string | null): boolean {
  return role === "ADMIN";
}

/** ADMIN ou EDITOR : accès à l'administration des contenus. */
export function isContentRole(role?: UserRole | string | null): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

/** Retourne la première section d'un chemin `/admin/<section>/…`. */
export function adminSectionOf(pathname: string): string {
  const match = pathname.match(/^\/admin(?:\/([^/?#]+))?/);
  return match?.[1] ?? "";
}

/** Un rôle donné peut-il ouvrir cette URL d'administration ? */
export function canAccessAdminPath(
  role: UserRole | string | null | undefined,
  pathname: string
): boolean {
  if (!isContentRole(role)) return false;
  if (isAdminRole(role)) return true;

  const section = adminSectionOf(pathname);
  return (CONTENT_SECTIONS as readonly string[]).includes(section);
}

/** Sections d'administration visibles dans la navigation pour un rôle. */
export function adminNavSections(role: UserRole | string | null | undefined): string[] {
  if (isAdminRole(role)) return ["", ...CONTENT_SECTIONS.slice(1), ...ADMIN_ONLY_SECTIONS];
  return [...CONTENT_SECTIONS];
}
