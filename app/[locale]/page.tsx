import type { Metadata } from "next";
import { HomeClient } from "@/components/HomeClient";
import { HomeStats } from "@/components/home/HomeStats";
import { LatestContent } from "@/components/LatestContent";
import { getDict, getLang, localizedAlternates } from "@/lib/i18n";
import { openGraphBase } from "@/lib/seo";

// La page d'accueil agrège des contenus éditoriaux (base de données) :
// elle est rendue à la demande pour rester toujours à jour.
export const dynamic = "force-dynamic";

/**
 * Métadonnées localisées + `hreflang` vers les 8 versions linguistiques :
 * chaque langue possède sa propre URL (`/fr`, `/en`, `/de`…), toutes déclarées
 * en alternates avec `x-default`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const lang = getLang();
  const t = getDict(lang);
  const title = `${t.hero.title1}${t.hero.title2}`;

  return {
    title,
    description: t.home.platformSubtitle,
    alternates: localizedAlternates(lang, "/"),
    openGraph: {
      ...openGraphBase(lang),
      title: `${title} — Trading Education`,
      description: t.home.platformSubtitle,
    },
  };
}

export default function HomePage() {
  // `stats` et `editorial` sont rendus côté serveur (contenus de la base) puis
  // injectés dans le composant client : contenu indexable + widgets interactifs.
  return <HomeClient stats={<HomeStats />} editorial={<LatestContent />} />;
}
