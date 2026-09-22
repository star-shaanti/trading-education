/**
 * Diagnostic d'environnement — vérifie tout ce qu'il faut pour que le site
 * fonctionne (localement ou sur la base de production via `DATABASE_URL`).
 *
 * Usage : npm run check:env
 *
 * Contrôles : variables obligatoires (dont `NEXTAUTH_SECRET`, cause du 500
 * « Application error » quand il manque), connexion PostgreSQL, présence du
 * schéma, administrateur et contenus.
 */
import { existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

let failures = 0;
function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

/** Information sans conséquence : n'invalide pas le diagnostic. */
function warn(label, ok, detail = "") {
  console.log(`${ok ? "OK  " : "WARN"} ${label}${detail ? ` — ${detail}` : ""}`);
}

const env = (key) => (process.env[key] ?? "").trim();

/* Garde-fou : la commande doit être lancée depuis la racine du projet. */
if (!existsSync("package.json") || !existsSync("prisma")) {
  console.error(
    "Ce script doit être lancé depuis la racine du projet (là où se trouvent package.json et prisma/).\n" +
      "→ cd c:\\TradingEducation\\trading-education   puis   npm run check:env"
  );
  process.exit(1);
}

const databaseUrl = env("DATABASE_URL");

/* Pièges fréquents de copier-coller : deux URL, ou des chevrons de gabarit. */
const problems = [];
if ((databaseUrl.match(/:\/\//g) ?? []).length > 1) {
  problems.push(
    "DATABASE_URL contient plusieurs URL (une seule valeur attendue, sans espace ni retour à la ligne)"
  );
}
if (databaseUrl.includes("<") || databaseUrl.includes(">")) {
  problems.push("DATABASE_URL contient encore un gabarit entre ‹chevrons› (remplacez-le par la valeur réelle)");
}
if (/^postgres(ql)?:\/\/[^:]*:[^@]*@[^/]*$/.test(databaseUrl)) {
  problems.push("DATABASE_URL est incomplète : il manque « /nom_de_la_base » (ex. /trading)");
}

const host = (() => {
  try {
    const url = new URL(databaseUrl.replace(/^postgres:/, "postgresql:"));
    return `${url.hostname}:${url.port || 5432}/${url.pathname.replace(/^\//, "")}`;
  } catch {
    return null;
  }
})();

const rawHost = host?.split(":")[0] ?? "";
const looksLikeContainer = Boolean(rawHost) && !rawHost.includes(".") && !["localhost", "127.0.0.1"].includes(rawHost);

/* 1. Variables d'environnement --------------------------------------------- */
for (const key of ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL", "NEXT_PUBLIC_SITE_URL"]) {
  check(`variable obligatoire ${key}`, Boolean(env(key)), env(key) ? env(key).replace(/(:\/\/[^:]+:)[^@]+@/, "$1***@") : "manquante");
}
check("NEXTAUTH_SECRET ≥ 32 caractères", env("NEXTAUTH_SECRET").length >= 32, `${env("NEXTAUTH_SECRET").length} caractères`);
check("NEXTAUTH_URL commence par http(s)", /^https?:\/\//.test(env("NEXTAUTH_URL")));

for (const key of ["IP_SALT", "CRON_SECRET", "ADMIN_EMAIL", "STORAGE_DIR"]) {
  check(`variable recommandée ${key}`, Boolean(env(key)));
}

/* 2. Forme de l'URL et cible de la base ------------------------------------ */
if (problems.length) {
  console.log();
  for (const problem of problems) check("forme de DATABASE_URL", false, problem);
}

console.log(`\n  DATABASE_URL → ${host ?? `(illisible : ${databaseUrl.slice(0, 60)}…)`}`);
if (host) {
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    console.log(
      "  (base locale — l'URL interne Coolify « nom-de-conteneur:5432 » ne fonctionne QUE dans le réseau Docker de Coolify)\n"
    );
  } else if (looksLikeContainer) {
    console.log(
      "  ⚠ Cet hôte ressemble à un nom de conteneur Docker (donc à une URL INTERNE Coolify) :\n" +
        "    il est illisible depuis ce PC. Deux solutions :\n" +
        "      1. depuis ce PC → URL PUBLIQUE : IP du serveur + port public de la base\n" +
        "         (Coolify → PostgreSQL → Configuration → General → « Make it publicly available »)\n" +
        "      2. depuis le réseau Coolify → lancez ce diagnostic dans le Terminal du conteneur applicatif\n"
    );
  } else {
    console.log("  (base distante)\n");
  }
}

if (problems.length || !host) {
  console.log("Environnement : DATABASE_URL invalide — connexion non testée ❌");
  process.exit(1);
}

/* 3. Base de données -------------------------------------------------------- */
const prisma = new PrismaClient();
try {
  await prisma.$queryRawUnsafe("select 1");
  check("connexion PostgreSQL", true);

  const [users, admins, articles, reports, webinars, subscribers, comments] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.article.count(),
    prisma.report.count(),
    prisma.webinar.count(),
    prisma.subscriber.count(),
    prisma.comment.count(),
  ]);

  check("schéma initialisé (tables présentes)", true);
  check(
    "un administrateur existe",
    admins > 0,
    admins > 0 ? `${admins} admin(s) sur ${users} membre(s)` : "→ npm run db:seed (ADMIN_EMAIL / ADMIN_PASSWORD)"
  );
  check(
    "contenus publiés",
    articles + reports + webinars > 0,
    `articles=${articles} rapports=${reports} webinaires=${webinars} abonnés=${subscribers} commentaires=${comments}` +
      (articles + reports + webinars === 0 ? " → npm run db:seed && npm run db:import-guides" : "")
  );
} catch (error) {
  check("connexion PostgreSQL / schéma", false, String(error.message).split("\n").slice(-2).join(" ").slice(0, 260));
} finally {
  await prisma.$disconnect();
}

/* 4. Stockage des fichiers -------------------------------------------------- */
const storage = env("STORAGE_DIR") || "./storage";
warn(
  "dossier de stockage (uploads PDF/images)",
  existsSync(storage),
  existsSync(storage) ? storage : `${storage} absent — créé par l'image Docker en production (/app/storage)`
);

console.log(
  failures === 0
    ? "\nEnvironnement : tout est prêt ✅"
    : `\nEnvironnement : ${failures} problème(s) à corriger ❌`
);
process.exitCode = failures === 0 ? 0 : 1;
