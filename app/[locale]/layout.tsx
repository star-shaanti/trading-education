import { notFound } from "next/navigation";
import { LANGUAGES, isLang } from "@/lib/i18n/languages";

/**
 * Layout du segment `[locale]` : toutes les pages publiques vivent sous
 * `/{langue}/...` (fr, en, es, de, it, hi, ar, ru).
 *
 * - `generateStaticParams` déclare les 8 langues valides ;
 * - `dynamicParams = false` renvoie un 404 pour tout autre préfixe ;
 * - la langue est transmise par le middleware (en-tête `x-te-locale`) et lue
 *   côté serveur par `getLang()` : chaque page est donc rendue dans la langue
 *   de son URL (indexation + hreflang).
 */
export function generateStaticParams() {
  return LANGUAGES.map((language) => ({ locale: language.code }));
}

export const dynamicParams = false;

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLang(params.locale)) notFound();
  return <>{children}</>;
}
