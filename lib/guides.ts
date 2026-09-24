/**
 * Identifiants des guides pédagogiques (pages statiques servies sous
 * `/{langue}/guides/<id>`).
 *
 * Le contenu (titres, descriptions, corps HTML) vit dans les pages
 * `app/[locale]/guides/page.tsx` (liste) et
 * `app/[locale]/guides/[id]/page.tsx` (détail). Cette liste sert au **sitemap**
 * pour déclarer chaque guide aux moteurs de recherche : ce sont des pages de
 * contenu réel (≈ 500 à 1 000 mots FR/EN chacune), signal déterminant pour
 * Google — et donc pour AdSense, qui refuse les sites « à faible contenu ».
 *
 * ⚠️ Ajouter/retirer un guide **ici ET dans les deux pages** ci-dessus.
 * `npm run test:seo` vérifie que chaque guide déclaré dans le sitemap répond
 * bien HTTP 200 (une entrée orpheline fait échouer les tests).
 */
export const GUIDE_IDS = [
  "rsi",
  "money-management",
  "leverage",
  "ichimoku",
  "economic-calendar",
  "risk-reward",
  "psychology",
  "backtesting",
  "dca-vs-swing",
  "timeframes",
] as const;

/** Chemins (sans préfixe de langue) des guides, prêts pour le sitemap. */
export const GUIDE_PATHS: string[] = GUIDE_IDS.map((id) => `/guides/${id}`);
