/**
 * Vérifie un bloc de variables d'environnement AVANT de le coller dans Coolify.
 *
 * Usage :
 *   npm run check:env-block -- bloc.txt
 *   # ou, directement depuis le presse-papiers (PowerShell) :
 *   Get-Clipboard | Set-Content bloc.txt ; npm run check:env-block -- bloc.txt
 *
 * Détecte : noms invalides (espaces → « Postgres: command not found »), valeurs
 * encore en gabarit (<mdp>, MOT_DE_PASSE, CHAINE_ALEATOIRE…), doublons, URL
 * multiples, guillemets manquants, variables obligatoires absentes.
 * Aucun secret n'est affiché.
 */
import { existsSync, readFileSync } from "node:fs";

const file = process.argv[2];
if (!file || !existsSync(file)) {
  console.error("Indiquez un fichier : npm run check:env-block -- bloc.txt");
  process.exit(1);
}

const raw = readFileSync(file, "utf8").trim();

if (/^(ghp_|github_pat_|gho_|ghs_|ghu_|ghr_)/.test(raw)) {
  console.log(`Ce fichier contient un JETON GitHub (${raw.slice(0, 4)}…, ${raw.length} caractères), pas un bloc de variables.`);
  process.exit(0);
}

const PLACEHOLDER = /(MOT_DE_PASSE|CHAINE_ALEATOIRE|LE_SECRET|VOTRE_|remplacer|remplacez|xxxx)/i;
const REQUIRED = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL", "NEXT_PUBLIC_SITE_URL"];

const entries = [];
for (const [index, line] of raw.split(/\r?\n/).entries()) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (!match) {
    entries.push({ name: `(ligne ${index + 1})`, value: trimmed, malformed: true });
    continue;
  }
  const name = match[1].trim();
  const rawValue = match[2].trim();
  const quoted = /^".*"$/.test(rawValue);
  entries.push({ name, value: quoted ? rawValue.slice(1, -1) : rawValue, quoted });
}

function mask({ name, value }) {
  if (/SECRET|PASSWORD|KEY|TOKEN|SALT/i.test(name)) return value ? `${value.slice(0, 4)}… (${value.length} car.)` : "(vide)";
  if (name === "DATABASE_URL") return value.replace(/:([^:@/]+)@/, ":***@");
  return value.length > 64 ? `${value.slice(0, 61)}…` : value || "(vide)";
}

console.log(`Bloc analysé : ${entries.length} ligne(s)\n`);
const fixes = [];
const notes = [];
const seen = new Set();

for (const entry of entries) {
  const { name, value, quoted, malformed } = entry;
  const problems = [];

  if (malformed) {
    problems.push("ligne mal formée (NOM=valeur attendu)");
  } else if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    problems.push("NOM INVALIDE (espace ou caractère interdit) → casse le build Coolify");
  }
  if (seen.has(name)) problems.push("définie plusieurs fois");
  seen.add(name);

  if (name === "DATABASE_URL") {
    if (/(MOT_DE_PASSE|motdepasse|CHANGEME)/i.test(value)) {
      problems.push("mot de passe encore un gabarit → recopier l'Internal URL de Coolify");
    }
    if ((value.match(/:\/\//g) ?? []).length > 1) problems.push("plusieurs URL dans une seule valeur");
    if (!/\/(postgres|trading|site|app)(\?|$)/.test(value)) problems.push("nom de base manquant en fin d'URL");
  } else if (PLACEHOLDER.test(value) && !(name === "EMAIL_FROM" && /<[^>]+@[^>]+>/.test(value))) {
    problems.push("valeur = gabarit à remplacer");
  }

  if (!problems.length && /\s/.test(value) && !quoted) {
    notes.push(`${name} : entourer la valeur de guillemets " " (elle contient des espaces)`);
  }

  console.log(`${problems.length ? "X " : "OK"} ${name.padEnd(22)} = ${mask(entry)}`);
  for (const problem of problems) {
    console.log(`       -> ${problem}`);
    fixes.push(`${name} : ${problem}`);
  }
}

for (const key of REQUIRED) {
  if (!seen.has(key)) {
    console.log(`X  ${key.padEnd(22)} = (absent)`);
    fixes.push(`${key} : variable obligatoire absente`);
  }
}

console.log("\n--- À CORRIGER ---");
if (fixes.length) for (const fix of fixes) console.log(`  • ${fix}`);
else console.log("  rien : le bloc est directement utilisable ✔");
if (notes.length) {
  console.log("\n--- REMARQUES ---");
  for (const note of notes) console.log(`  • ${note}`);
}
process.exitCode = fixes.length === 0 ? 0 : 1;
