import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { LANG_COOKIE, normalizeLang } from "@/lib/i18n/languages";
import { LOCALE_HEADER, isGlobalPath, localeFromPath, withLocale } from "@/lib/i18n/locale-path";
import { canAccessAdminPath } from "@/lib/roles";

/**
 * Middleware unique :
 *
 * 1. **Zones privées** (`/admin`, `/espace-membre`) : authentification (le rôle
 *    est porté par le JWT, aucune requête base ici).
 * 2. **Routage multilingue** : les pages publiques vivent sous `/{langue}/...`.
 *    - URL préfixée  → la langue de l'URL est transmise aux Server Components
 *      via l'en-tête `x-te-locale` (lu par `getLang()`), ce qui rend chaque
 *      langue indexable (hreflang + canonique par URL) ;
 *    - URL historique sans préfixe → redirection permanente (308) vers la
 *      version localisée, selon le cookie `te_lang` (préférence) ou le défaut.
 * 3. Les chemins techniques/transactionnels (API, auth, newsletter, flux,
 *    sitemaps, images) ne sont jamais préfixés.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /**
   * 0. Hôte canonique : tout domaine `www.*` est redirigé (308) vers l'apex.
   * Le site se déclare sur `https://tradingeducationpro.com` (canoniques,
   * sitemap, `NEXTAUTH_URL`) : sans cela, Google indexe deux sites miroirs et
   * l'ads.txt n'est vérifié que sur l'hôte déclaré dans AdSense.
   *
   * Note : les fichiers statiques (`/public`, dont `/ads.txt`) ne passent pas
   * par le middleware (cf. `matcher` plus bas) — indispensable pour qu'AdSense
   * lise `/ads.txt` **aussi** via `www`.
   */
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    // ⚠️ `nextUrl` est bâtie sur l'adresse interne du serveur (`HOSTNAME:PORT`,
    // ex. `0.0.0.0:3000` en Docker) et l'API `URL` **conserve le port** quand on
    // ne réaffecte que `host` : la redirection pointait donc vers
    // `https://tradingeducationpro.com:3000/...` (injoignable). On retire donc
    // explicitement le port (celui de l'URL interne comme celui, éventuel, de
    // l'en-tête `Host`) pour ne publier que l'hôte canonique.
    url.host = host.slice(4).replace(/:\d+$/, "");
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  // 1. Zones privées : authentification (comportement inchangé).
  if (pathname.startsWith("/admin") || pathname.startsWith("/espace-membre")) {
    // `getToken` peut lever si le secret est absent : on refuse l'accès (fail-closed)
    // plutôt que de renvoyer une erreur 500.
    let token: Awaited<ReturnType<typeof getToken>> = null;
    try {
      token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET });
    } catch {
      token = null;
    }

    if (!token) {
      const url = new URL("/connexion", request.url);
      url.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin") && !canAccessAdminPath(token.role as string | undefined, pathname)) {
      const target = token.role === "EDITOR" ? "/admin" : "/connexion?callbackUrl=/admin";
      return NextResponse.redirect(new URL(target, request.url));
    }

    return forward(request, normalizeLang(request.cookies.get(LANG_COOKIE)?.value));
  }

  // 2. Chemins hors périmètre linguistique : on transmet la langue préférée.
  if (isGlobalPath(pathname)) {
    return forward(request, normalizeLang(request.cookies.get(LANG_COOKIE)?.value));
  }

  // 3. URL déjà localisée : la langue de l'URL fait foi.
  const locale = localeFromPath(pathname);
  if (locale) {
    return forward(request, locale);
  }

  // 3 bis. Préfixe ressemblant à une langue mais non supporté (`/xx/...`) :
  // on laisse Next répondre (404 grâce à `dynamicParams = false`).
  const firstSegment = pathname.split("/")[1] ?? "";
  if (/^[a-z]{2}(-[a-z]{2})?$/i.test(firstSegment)) {
    return forward(request, normalizeLang(request.cookies.get(LANG_COOKIE)?.value));
  }

  // 4. URL historique : redirection permanente vers la version localisée.
  const preferred = normalizeLang(request.cookies.get(LANG_COOKIE)?.value);
  const url = request.nextUrl.clone();
  url.pathname = withLocale(pathname, preferred);
  return NextResponse.redirect(url, 308);
}

/** Transmet la langue résolue dans les en-têtes lus par les Server Components. */
function forward(request: NextRequest, locale: string) {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Tout sauf les fichiers statiques et les assets Next.
  matcher: ["/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)"],
};
