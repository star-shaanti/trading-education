import type { Lang } from "../languages";
import type { Dict } from "./types";
import { fr } from "./fr";
import { en } from "./en";
import { es } from "./es";
import { de } from "./de";
import { it } from "./it";
import { hi } from "./hi";
import { ar } from "./ar";
import { ru } from "./ru";

export type { Dict, HomeCardText } from "./types";

/** Tous les dictionnaires, indexés par code de langue. */
export const dictionaries: Record<Lang, Dict> = { fr, en, es, de, it, hi, ar, ru };

/**
 * Retourne le dictionnaire d'interface d'une langue.
 * Module pur (sans `next/headers`) : utilisable côté serveur ET client.
 */
export function getDict(lang: Lang): Dict {
  return dictionaries[lang] ?? dictionaries.fr;
}
