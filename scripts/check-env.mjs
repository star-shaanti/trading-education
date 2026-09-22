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
const host = (() => {
  try {
    const url = new URL(env("DATABASE_URL").replace(/^postgresql:/, "postgres:"));
    return `${url.hostname}:${url.port || 5432}/${url.pathname.replace(/^\//, "")}`;
  } catch {
    return "(URL invalide)";
  }
})();

/* 1. Variables d'environnement --------------------------------------------- */
for (const key of ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL", "NEXT_PUBLIC_SITE_URL"]) {
  check(`variable obligatoire ${key}`, Boolean(env(key)), env(key) ? env(key).replace(/(:\/\/[^:]+:)[^@]+@/, "$1***@") : "manquante");
}
check("NEXTAUTH_SECRET ≥ 32 caractères", env("NEXTAUTH_SECRET").length >= 32, `${env("NEXTAUTH_SECRET").length} caractères`);
check("NEXTAUTH_URL commence par http(s)", /^https?:\/\//.test(env("NEXTAUTH_URL")));

for (const key of ["IP_SALT", "CRON_SECRET", "ADMIN_EMAIL", "STORAGE_DIR"]) {
  check(`variable recommandée ${key}`, Boolean(env(key)));
}

/* 2. Cible de la base ------------------------------------------------------- */
console.log(`\n  DATABASE_URL → ${host}`);
console.log(
  host.includes("localhost") || host.includes("127.0.0.1")
    ? "  (base locale — l'URL interne Coolify « postgresql-xxxx:5432 » ne fonctionne QUE dans le réseau Docker de Coolify)\n"
    : "  (base distante)\n"
);

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
