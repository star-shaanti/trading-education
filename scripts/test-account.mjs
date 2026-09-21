/**
 * Test E2E « Paramètres du compte » :
 * 1. `POST /api/membre/suspension` sans session → 401 ;
 * 2. suspension → `User.suspendedAt` enregistré + emails interrompus ;
 * 3. `DELETE /api/membre/suspension` → réactivation manuelle ;
 * 4. reconnexion d'un compte suspendu → réactivation automatique ;
 * 5. `DELETE /api/membre/donnees` → suppression définitive (action du menu) ;
 * 6. les libellés « Paramètres / Suspendre / Supprimer » sont bien livrés dans
 *    le bundle client (l'ouverture du menu et la boîte de confirmation sont
 *    vérifiées manuellement : pas de navigateur headless dans ce projet).
 *
 * Usage : node scripts/test-account.mjs [baseUrl]
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const BASE = (process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const prisma = new PrismaClient();

const STAMP = Date.now();
const EMAIL = `membre.suspension.${STAMP}@test.local`;
const PASSWORD = "TestSuspension123!";
/**
 * IP dédiée (`x-forwarded-for`) : la suspension est limitée à 5 requêtes/minute
 * par IP, ce qui ferait échouer deux exécutions rapprochées du test.
 */
const IP_HEADERS = { "x-forwarded-for": `198.18.${STAMP % 250}.${(STAMP % 199) + 1}` };

let failures = 0;
function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

function cookiesOf(response) {
  const raw = response.headers.getSetCookie?.() ?? [];
  return raw.map((cookie) => cookie.split(";")[0]);
}

/** Connexion réelle via NextAuth credentials. */
async function login(email, password) {
  const csrfResponse = await fetch(`${BASE}/api/auth/csrf`);
  const { csrfToken } = await csrfResponse.json();
  let cookies = cookiesOf(csrfResponse);

  const response = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", cookie: cookies.join("; ") },
    body: new URLSearchParams({ email, password, csrfToken, json: "true" }),
    redirect: "manual",
  });
  cookies = [...cookies, ...cookiesOf(response)];

  return {
    status: response.status,
    cookieHeader: cookies.join("; "),
    authenticated: cookies.some((cookie) => cookie.includes("next-auth.session-token")),
  };
}

async function run() {
  /* 1. Sans session : la suspension est refusée. */
  const anonymous = await fetch(`${BASE}/api/membre/suspension`, {
    method: "POST",
    headers: IP_HEADERS,
  });
  check("suspension sans session → 401", anonymous.status === 401, String(anonymous.status));

  /* 2. Création d'un membre de test puis connexion. */
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      name: "Membre Suspension",
      passwordHash,
      role: "MEMBER",
      locale: "fr",
      consentAt: new Date(),
    },
  });

  const session = await login(EMAIL, PASSWORD);
  check("connexion du membre de test", session.authenticated, `status=${session.status}`);

  const memberArea = await fetch(`${BASE}/espace-membre`, {
    headers: { cookie: session.cookieHeader },
    redirect: "manual",
  });
  check("espace membre accessible", memberArea.status === 200, String(memberArea.status));

  const prefsPage = await fetch(`${BASE}/espace-membre/preferences`, {
    headers: { cookie: session.cookieHeader },
    redirect: "manual",
  });
  const prefsHtml = await prefsPage.text();
  check("préférences email accessibles", prefsPage.status === 200, String(prefsPage.status));
  check("préférences → zone de suppression rendue", prefsHtml.includes("Zone de suppression"));

  /* 3. Suspension. */
  const suspend = await fetch(`${BASE}/api/membre/suspension`, {
    method: "POST",
    headers: { cookie: session.cookieHeader, ...IP_HEADERS },
  });
  check("POST /api/membre/suspension → 200", suspend.status === 200, String(suspend.status));

  const suspended = await prisma.user.findUnique({
    where: { id: user.id },
    select: { suspendedAt: true, newsletterOptIn: true, reportsOptIn: true, webinarsOptIn: true },
  });
  check("suspension → suspendedAt enregistré", Boolean(suspended?.suspendedAt));
  check(
    "suspension → emails interrompus",
    suspended?.newsletterOptIn === false &&
      suspended?.reportsOptIn === false &&
      suspended?.webinarsOptIn === false
  );

  /* 4. Réactivation manuelle (DELETE). */
  const reactivate = await fetch(`${BASE}/api/membre/suspension`, {
    method: "DELETE",
    headers: { cookie: session.cookieHeader, ...IP_HEADERS },
  });
  check("DELETE /api/membre/suspension → 200", reactivate.status === 200, String(reactivate.status));

  const reactivated = await prisma.user.findUnique({
    where: { id: user.id },
    select: { suspendedAt: true },
  });
  check("réactivation manuelle → suspendedAt remis à null", reactivated?.suspendedAt === null);

  /* 5. Suspension puis reconnexion → réactivation automatique. */
  const resuspend = await fetch(`${BASE}/api/membre/suspension`, {
    method: "POST",
    headers: { cookie: session.cookieHeader, ...IP_HEADERS },
  });
  check("seconde suspension → 200", resuspend.status === 200, String(resuspend.status));

  const beforeRelogin = await prisma.user.findUnique({
    where: { id: user.id },
    select: { suspendedAt: true },
  });
  check("suspension avant reconnexion", Boolean(beforeRelogin?.suspendedAt));

  const relogin = await login(EMAIL, PASSWORD);
  check("reconnexion d'un compte suspendu acceptée", relogin.authenticated, `status=${relogin.status}`);

  const afterRelogin = await prisma.user.findUnique({
    where: { id: user.id },
    select: { suspendedAt: true, lastLoginAt: true },
  });
  check("reconnexion → compte réactivé automatiquement", afterRelogin?.suspendedAt === null);
  check("reconnexion → lastLoginAt mis à jour", Boolean(afterRelogin?.lastLoginAt));

  /* 6. Libellés du sous-menu « Paramètres » livrés au client. */
  const chunkUrls = new Set();
  for (const cookie of ["", relogin.cookieHeader]) {
    const response = await fetch(`${BASE}/fr`, { headers: cookie ? { cookie } : {} });
    const html = await response.text();
    for (const match of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+\.js)"/g)) {
      chunkUrls.add(match[1]);
    }
  }

  const sources = await Promise.all(
    [...chunkUrls].map(async (url) => {
      const response = await fetch(`${BASE}${url}`);
      return response.ok ? response.text() : "";
    })
  );
  const bundle = sources.join("\n");
  // Les bundles Next.js échappent les accents (`Param\xe8tres`) : on décode avant comparaison.
  const decoded = bundle
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)));
  check("bundle client → « Paramètres » présent", decoded.includes("Paramètres"), `${chunkUrls.size} chunk(s)`);
  check("bundle client → « Suspendre mon compte » présent", decoded.includes("Suspendre mon compte"));
  check("bundle client → « Supprimer mon compte » présent", decoded.includes("Supprimer mon compte"));
  check("bundle client → confirmation « Se déconnecter ? » présente", decoded.includes("Se déconnecter ?"));

  /* 7. Suppression définitive (action confirmée du menu utilisateur). */
  const deletion = await fetch(`${BASE}/api/membre/donnees`, {
    method: "DELETE",
    headers: { cookie: relogin.cookieHeader },
  });
  check("DELETE /api/membre/donnees → 200", deletion.status === 200, String(deletion.status));

  const gone = await prisma.user.findUnique({ where: { id: user.id } });
  check("suppression → compte effacé de la base", gone === null);
}

try {
  await run();
} finally {
  // Nettoyage garanti, même en cas d'échec.
  await prisma.user.deleteMany({ where: { email: EMAIL } });
  await prisma.subscriber.deleteMany({ where: { email: EMAIL } });
  await prisma.$disconnect();
}

console.log(
  failures === 0 ? "\nParamètres du compte : tous OK" : `\nParamètres du compte : ${failures} échec(s)`
);
process.exitCode = failures === 0 ? 0 : 1;
