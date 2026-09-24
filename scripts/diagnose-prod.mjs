/**
 * Diagnostic du SITE DÉPLOYÉ, depuis votre terminal.
 *
 * Usage :
 *   npm run diagnose:prod
 *   npm run diagnose:prod -- https://tradingeducationpro.com
 *
 * Vérifie, sans rien modifier : application vivante, configuration NextAuth,
 * rendu des pages (500 « Application error » ?), accès à la base via les
 * contenus publiés (feed/sitemap), route et page d'inscription.
 */
const BASE = (process.argv[2] ?? process.env.SITE_URL ?? "https://tradingeducationpro.com").replace(/\/$/, "");

let failures = 0;
function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

async function get(path) {
  try {
    const response = await fetch(`${BASE}${path}`, { redirect: "manual" });
    return {
      status: response.status,
      type: response.headers.get("content-type") ?? "",
      body: await response.text(),
    };
  } catch (error) {
    return { status: 0, type: "", body: error instanceof Error ? error.message : String(error) };
  }
}

console.log(`Cible : ${BASE}\n`);

/* 1. L'application répond-elle ? (route sans session ni base) */
const robots = await get("/robots.txt");
check("application vivante (/robots.txt)", robots.status === 200, `HTTP ${robots.status}`);

/* 1 bis. ads.txt : lu par AdSense à la RACINE du domaine interrogé, en texte
   brut et sans redirection. Un 404, un 308 vers `/{langue}/ads.txt` ou une page
   HTML fait afficher « État de l'ads.txt : introuvable » dans AdSense. */
const ADS_PUB_ID = "pub-5343389597650456";
const ads = await get("/ads.txt");
check(
  "ads.txt servi à la racine (AdSense)",
  ads.status === 200 && ads.type.includes("text/plain") && ads.body.includes(ADS_PUB_ID),
  `HTTP ${ads.status}${ads.type ? ` · ${ads.type}` : ""}` +
    (ads.status !== 200
      ? " → AdSense affichera « état de l'ads.txt : introuvable »"
      : ads.body.includes(ADS_PUB_ID)
        ? ""
        : ` → la ligne google.com, ${ADS_PUB_ID}, DIRECT, … est absente`)
);

/* 1 ter. AdSense interroge l'hôte exact du site déclaré dans le compte : si le
   site y est enregistré en `www`, le sous-domaine doit servir le même fichier. */
const adsHost = new URL(`${BASE}/ads.txt`).hostname;
if (!adsHost.startsWith("www.")) {
  const wwwUrl = `${new URL(BASE).protocol}//www.${adsHost}/ads.txt`;
  try {
    const www = await fetch(wwwUrl, { redirect: "manual" });
    const wwwBody = await www.text();
    check(
      `ads.txt accessible via www (${wwwUrl})`,
      www.status === 200 && wwwBody.includes(ADS_PUB_ID),
      www.status === 200
        ? ""
        : `HTTP ${www.status} → ajouter www.${adsHost} dans Coolify → Domains ` +
          "(redirection vers le domaine principal) puis relancer le certificat, " +
          "ou déclarer le site sans www dans AdSense → Sites"
    );
  } catch (error) {
    // Node n'expose le détail (TLS, DNS) que dans `error.cause`.
    const cause = error instanceof Error && error.cause instanceof Error ? `: ${error.cause.message}` : "";
    const message = `${error instanceof Error ? error.message : String(error)}${cause}`;
    if (/ENOTFOUND|EAI_AGAIN/i.test(message)) {
      console.log(`INFO www.${adsHost} non résolu — contrôle www ignoré`);
    } else {
      check(
        `ads.txt accessible via www (${wwwUrl})`,
        false,
        `${message.split("\n")[0]} → certificat/route www absent : à corriger dans Coolify ` +
          "(Domains + Let's Encrypt) ou à retirer du compte AdSense"
      );
    }
  }

  /* Redirection `www` → apex (middleware) : la cible ne doit jamais contenir le
     port interne du conteneur (`…:3000`), qui rend le domaine injoignable
     (« Ce site est inaccessible »). */
  const wwwHomeUrl = `${new URL(BASE).protocol}//www.${adsHost}/`;
  try {
    const wwwHome = await fetch(wwwHomeUrl, { redirect: "manual" });
    const location = wwwHome.headers.get("location") ?? "";
    const portExposed = /:\d+/.test(location);
    check(
      `www redirigé vers l'apex sans port interne (${wwwHomeUrl})`,
      wwwHome.status >= 300 && wwwHome.status < 400 && !portExposed,
      location
        ? `HTTP ${wwwHome.status} → ${location}` +
            (portExposed ? " → port interne exposé : vérifier le middleware (redirection www)" : "")
        : `HTTP ${wwwHome.status} sans en-tête Location`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`INFO redirection www non testée (${message.split("\n")[0]})`);
  }
}

/* 2. Configuration NextAuth : 500 ici = NEXTAUTH_SECRET/URL manquant */
const csrf = await get("/api/auth/csrf");
check(
  "NextAuth configuré (/api/auth/csrf)",
  csrf.status === 200,
  csrf.status === 500
    ? "HTTP 500 « There is a problem with the server configuration » → NEXTAUTH_SECRET / NEXTAUTH_URL à définir dans Coolify"
    : `HTTP ${csrf.status}`
);

const session = await get("/api/auth/session");
check("API session (/api/auth/session)", session.status === 200, `HTTP ${session.status}`);

/* 3. Rendu des pages */
const home = await get("/fr");
const digest =
  home.body.match(/"(?:digest|errorDigest)":"?(\d+)/)?.[1] ?? home.body.match(/Digest:\s*(\d+)/)?.[1];
check(
  "page d'accueil rendue (/fr)",
  home.status === 200 && !home.body.includes("Application error"),
  `HTTP ${home.status}${digest ? ` · digest ${digest}` : ""}${
    home.status === 500 ? " → cause exacte dans Coolify → Logs (Application)" : ""
  }`
);

const connexion = await get("/connexion");
check("page de connexion servie (/connexion)", connexion.status === 200, `HTTP ${connexion.status}`);

/* 4. Base de données, mesurée par le contenu réellement publié */
const feed = await get("/feed.xml");
const items = (feed.body.match(/<item>/g) ?? []).length;
const sitemap = await get("/sitemaps/fr/sitemap.xml");
const urls = (sitemap.body.match(/<loc>/g) ?? []).length;
check(
  "base joignable et contenus publiés (feed + sitemap)",
  feed.status === 200 && sitemap.status === 200 && (items > 0 || urls > 12),
  `feed=${items} item(s) · sitemap=${urls} URL(s)` +
    (items === 0 || urls <= 12
      ? " → base vide : lancer le seed (docs/EXPLOITATION.md §4.5 — terminal Coolify : npm run db:deploy && npm run db:seed)"
      : "")
);

/* 4 bis. Volume de contenu : AdSense refuse les sites « à faible contenu ».
   Pages de contenu réel = analyses + rapports + webinaires + guides. */
const contentPaths = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1].replace(/^https?:\/\/[^/]+/, ""))
  .filter((path) => /\/(analyses|rapports|webinaires|guides)\/[^/]+$/.test(path));
check(
  `volume de contenu FR (${contentPaths.length} page(s) de contenu réel)`,
  contentPaths.length >= 10,
  contentPaths.length >= 10
    ? ""
    : "→ Google/AdSense jugent le site « à faible contenu » : npm run db:import-guides " +
      "(10 guides) + publier des analyses — voir docs/EXPLOITATION.md §14"
);

/* 5. Inscription (payload invalide : aucune écriture en base) */
const register = await fetch(`${BASE}/api/inscription`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
const registerBody = await register.text();
check(
  "route d'inscription vivante (/api/inscription)",
  register.status === 400,
  register.status === 500
    ? "HTTP 500 → base de données absente ou injoignable (voir Logs Coolify)"
    : `HTTP ${register.status} ${registerBody.slice(0, 90)}`
);

const inscription = await get("/inscription");
check("page d'inscription servie (/inscription)", inscription.status === 200, `HTTP ${inscription.status}`);

console.log(
  failures === 0
    ? "\nSite déployé : tout fonctionne ✅"
    : `\nSite déployé : ${failures} point(s) à corriger ❌ (détails ci-dessus)`
);
process.exitCode = failures === 0 ? 0 : 1;
