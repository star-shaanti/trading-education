"use client";

import NextLink from "next/link";
import { useLang } from "@/components/LangContext";
import { withLocale } from "@/lib/i18n/locale-path";

/** Props acceptées : celles de `next/link` (children, className, aria-*…). */
type LocalizedLinkProps = React.ComponentProps<typeof NextLink>;

/**
 * Lien interne **localisé** : préfixe automatiquement l'URL par la langue de
 * l'interface (`/analyses` → `/fr/analyses`, `/de/analyses`…).
 *
 * Les liens externes, `mailto:`, les ancres et les chemins hors périmètre
 * (admin, connexion, API, newsletter, flux…) sont transmis inchangés.
 *
 * Ce composant remplace `next/link` dans l'application : les URLs restent
 * écrites sans langue (une seule source de vérité dans le code) et la langue
 * vient du contexte, elle-même alimentée par l'URL puis le cookie.
 */
export function Link({ href, ...props }: LocalizedLinkProps) {
  const { lang } = useLang();

  const localized: LocalizedLinkProps["href"] =
    typeof href === "string"
      ? withLocale(href, lang)
      : { ...href, pathname: withLocale(href.pathname ?? "/", lang) };

  return <NextLink href={localized} {...props} />;
}
