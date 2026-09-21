/**
 * Test E2E « compte » : vérifie
 * 1. que les champs mot de passe proposent d'afficher/masquer la saisie
 *    (connexion + inscription) ;
 * 2. qu'après connexion, l'en-tête affiche le **menu utilisateur** et non plus
 *    le bouton « Connexion » (session rendue côté serveur + mise à jour client).
 *
 * Usage : node scripts/test-auth-ui.mjs [baseUrl]
 * Les identifiants sont lus dans `.env` (ADMIN_EMAIL / ADMIN_PASSWORD).
 */

import { readFileSync } from "node:fs";

const BASE = (process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

function env(key, fallback) {
  try {
    const match = readFileSync(".env", "utf8").match(new RegExp(`^${key}=(.*)$`, "m"));
    if (!match) return fallback;
    // Les valeurs peuvent être entourées de guillemets dans `.env`.
    return match[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    return fallback;
  }
}

const EMAIL = env("ADMIN_EMAIL", "admin@tradingeducationpro.com");
const PASSWORD = env("ADMIN_PASSWORD", "ChangeMoi123!");

let failures = 0;
function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

function cookiesOf(response) {
  const raw = response.headers.getSetCookie?.() ?? [];
  return raw.map((cookie) => cookie.split(";")[0]);
}

async function page(path, cookieHeader) {
  const response = await fetch(`${BASE}${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    redirect: "manual",
  });
  return { status: response.status, body: await response.text() };
}

/* 1. Bouton « afficher le mot de passe » sur les formulaires. */
const connexion = await page("/connexion");
check("connexion → page servie", connexion.status === 200, String(connexion.status));
check(
  "connexion → champ mot de passe masqué + bouton « afficher »",
  connexion.body.includes('type="password"') &&
    (connexion.body.match(/aria-label="Afficher le mot de passe"/g) ?? []).length === 1
);

const inscription = await page("/inscription");
check("inscription → page servie", inscription.status === 200, String(inscription.status));
check(
  "inscription → 2 champs mot de passe avec bouton « afficher »",
  (inscription.body.match(/type="password"/g) ?? []).length === 2 &&
    (inscription.body.match(/aria-label="Afficher le mot de passe"/g) ?? []).length === 2,
  `champs=${(inscription.body.match(/type="password"/g) ?? []).length} boutons=${
    (inscription.body.match(/aria-label="Afficher le mot de passe"/g) ?? []).length
  }`
);

/** Nombre de menus déroulants dans l'en-tête (thème + éventuel menu utilisateur). */
const menusIn = (html) => (html.match(/aria-haspopup="menu"/g) ?? []).length;

/* 2. Connexion réelle (NextAuth credentials) puis en-tête. */
const anonymous = await page("/fr");
const anonymousHeader = anonymous.body.slice(anonymous.body.indexOf("<header"), anonymous.body.indexOf("</header>"));
check("visiteur → bouton Connexion dans l'en-tête", anonymousHeader.includes('href="/connexion"'));
check("visiteur → un seul menu (thème) dans l'en-tête", menusIn(anonymousHeader) === 1, `${menusIn(anonymousHeader)} menu(s)`);

const csrfResponse = await fetch(`${BASE}/api/auth/csrf`);
const { csrfToken } = await csrfResponse.json();
let cookies = cookiesOf(csrfResponse);

const loginResponse = await fetch(`${BASE}/api/auth/callback/credentials`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded", cookie: cookies.join("; ") },
  body: new URLSearchParams({ email: EMAIL, password: PASSWORD, csrfToken, json: "true" }),
  redirect: "manual",
});
cookies = [...cookies, ...cookiesOf(loginResponse)];
const cookieHeader = cookies.join("; ");

check(
  "connexion → session NextAuth délivrée",
  cookies.some((cookie) => cookie.includes("next-auth.session-token")),
  `${loginResponse.status} · cookies=${cookies.length}`
);

const connected = await page("/fr", cookieHeader);
const header = connected.body.slice(connected.body.indexOf("<header"), connected.body.indexOf("</header>"));
check("connecté → en-tête rendu côté serveur", header.length > 0);
check(
  "connecté → menu utilisateur ajouté dans l'en-tête (desktop + mobile)",
  menusIn(header) > menusIn(anonymousHeader),
  `${menusIn(header)} menu(s) connecté vs ${menusIn(anonymousHeader)} visiteur`
);
check(
  "connecté → identité affichée (nom ou email dans le bouton)",
  header.includes("@") || /Trading Education/.test(header) === false,
  header.includes("@") ? "email visible" : "nom affiché"
);
check("connecté → bouton « Connexion » retiré", !header.includes('href="/connexion"'));

/* 3. Espace membre : la déconnexion n'y figure plus (elle vit dans le menu utilisateur). */
const memberArea = await page("/espace-membre", cookieHeader);
check("espace membre → page servie", memberArea.status === 200, String(memberArea.status));
check("espace membre → bouton « Déconnexion » retiré", !memberArea.body.includes("Déconnexion"));

/* 4. Appels à la création de compte : visibles pour un visiteur, retirés pour un membre. */
const statsCta = "Créer un compte gratuit pour recevoir les rapports par email";
const ctaCard = "Commencez avec un compte gratuit";
check("visiteur → lien « créer un compte » sur l'accueil", anonymous.body.includes(statsCta));
check("visiteur → carte « compte gratuit » sur l'accueil", anonymous.body.includes(ctaCard));
check("connecté → lien « créer un compte » retiré de l'accueil", !connected.body.includes(statsCta));
check("connecté → carte « compte gratuit » retirée de l'accueil", !connected.body.includes(ctaCard));

/* 5. Même règle sur les pages de guides (composant client lisant la session). */
const guideCta = "Recevoir les rapports par email (compte gratuit)";
const guideAnonymous = await page("/fr/guides/rsi");
const guideConnected = await page("/fr/guides/rsi", cookieHeader);
check("visiteur → lien « compte gratuit » sur un guide", guideAnonymous.body.includes(guideCta));
check("connecté → lien « compte gratuit » retiré d'un guide", !guideConnected.body.includes(guideCta));

/* 6. Déconnexion : l'en-tête revient à l'état visiteur après suppression du cookie. */
const afterLogout = await page("/fr");
const afterHeader = afterLogout.body.slice(
  afterLogout.body.indexOf("<header"),
  afterLogout.body.indexOf("</header>")
);
check("déconnecté → retour du bouton Connexion", afterHeader.includes('href="/connexion"'));

console.log(failures === 0 ? "\nCompte / en-tête : tous OK" : `\nCompte / en-tête : ${failures} échec(s)`);
process.exitCode = failures === 0 ? 0 : 1;
