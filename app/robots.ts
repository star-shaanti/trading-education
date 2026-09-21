import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/i18n";

/** robots.txt dynamique : tout le contenu public est indexable. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/espace-membre",
          "/connexion",
          "/inscription?",
          "/mot-de-passe-oublie",
          "/reinitialiser-mot-de-passe",
          "/newsletter/",
        ],
      },
      /**
       * Robots des moteurs de réponse (IA) / crawlers de recherche : autorisés
       * explicitement — un contenu éducatif cité génère de la visibilité et des
       * liens. À exclure ici si la politique éditoriale change.
       */
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: ["/api/", "/admin", "/espace-membre"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
