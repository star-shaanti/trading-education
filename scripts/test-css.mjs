/**
 * Vérifie que la feuille de styles générée contient bien les utilitaires
 * responsive (breakpoints), RTL et logiques utilisés par les composants :
 * Tailwind ne génère que les classes réellement présentes dans le code, donc
 * cette vérification attrape une faute de frappe dans une classe.
 *
 * Usage :
 *   node scripts/test-css.mjs http://localhost:3100        (serveur de prod)
 *   node scripts/test-css.mjs --file .next/static/css/x.css  (fichier buildé)
 */

import { readFileSync } from "node:fs";

const target = process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3000";
const isFile = target === "--file";
const file = isFile ? process.argv[3] : null;
const base = (isFile ? "" : target).replace(/\/$/, "");

let css = "";

if (file) {
  css = readFileSync(file, "utf8");
  console.log(`CSS ${file} (${css.length} caractères)`);
} else {
  const html = await (await fetch(`${base}/`)).text();
  const hrefs = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]);
  if (hrefs.length === 0) {
    console.error("Aucune feuille de styles trouvée dans le HTML.");
    process.exit(1);
  }
  const sheets = await Promise.all(
    hrefs.map(async (href) => {
      const url = href.startsWith("http") ? href : `${base}${href}`;
      const response = await fetch(url);
      const text = await response.text();
      console.log(`CSS ${response.status} ${url} (${text.length} caractères)`);
      if (response.status !== 200) {
        console.error("Feuille de styles inaccessible : utilisez un serveur `next start`.");
        process.exit(1);
      }
      return text;
    })
  );
  css = sheets.join("\n");
}

/** [motif présent dans le CSS minifié, description] */
const CHECKS = [
  ["@media (min-width:640px)", "breakpoint sm: (tablettes)"],
  ["@media (min-width:768px)", "breakpoint md: (petits écrans)"],
  ["@media (min-width:1024px)", "breakpoint lg: (ordinateurs)"],
  ["padding-inline-start", "utilitaires logiques (ps-*)"],
  ["padding-inline-end", "utilitaires logiques (pe-*)"],
  ["inset-inline-start", "utilitaires logiques (start-*/end-*)"],
  ["margin-inline-start", "utilitaires logiques (ms-*)"],
  ["[dir=rtl]", "règles RTL explicites (globals.css)"],
  ["scale-x-100", "flèches retournées en RTL (rtl:-scale-x-100)"],
  ["--font-inter", "police Inter + repli multilingue"],
  ["overflow-wrap", "anti-débordement horizontal"],
  ["prefers-reduced-motion", "respect des préférences d'animation"],
  ["grid-template-columns", "grilles de cartes"],
  ["overflow-x-auto", "tableaux scrollables (admin, horaires)"],
];

let failures = 0;
for (const [needle, label] of CHECKS) {
  const ok = css.includes(needle);
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label} (${needle})`);
}

console.log(failures === 0 ? "\nCSS responsive/RTL : tous OK" : `\nCSS : ${failures} échec(s)`);
process.exitCode = failures === 0 ? 0 : 1;
