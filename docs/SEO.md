# Stratégie SEO — Trading Education (plateforme internationale)

> Document de référence : analyse concurrentielle, audit de notre stack, feuille
> de route priorisée, playbooks contenu/netlinking, mesure et budget.
> Dernière mise à jour : septembre 2026.

## 1. Résumé exécutif

- **Notre force** : contenu 100 % gratuit, 8 langues, outils interactifs, pages
  rendues côté serveur, sitemap/robots dynamiques, consentement RGPD propre.
- **Notre blocage n°1** : la langue est portée par un **cookie** (`te_lang`), donc
  les 8 langues partagent **une seule URL**. Google n'indexe qu'une version et
  ignore les 6 autres → une plateforme « internationale » invisible à
  l'international. C'est LE chantier structurant (URLs par langue + `hreflang`).
- **Notre blocage n°2** : nos 10 guides (meilleur actif SEO) sont des composants
  clients **sans aucune métadonnée** (pas de `title`, `description`, canonical,
  JSON-LD) et transportent 100 Ko de JS.
- **Notre blocage n°3** : aucune couche **E-E-A-T** (auteurs nommés, bios,
  credentials, politique éditoriale) alors que la finance est un sujet **YMYL**.
  Tous les concurrents qui gagnent affichent des auteurs identifiés.
- **Notre levier sous-exploité** : les **pages programmatiques** (glossaire,
  pages par indicateur, pages market/calendrier, comparateurs notés) — c'est le
  moteur n°1 de TradingSat, ABC Bourse, Bolsamania et Moneycontrol.
- **Objectif réaliste 12 mois** : 1 500–3 000 pages indexables utiles,
  visibilité dans 3–4 langues prioritaires (FR/EN/ES/DE), 30–60 k visites
  organiques/mois, 150+ backlinks référents, positionnement sur les requêtes
  « outil + pédagogie » plus que sur l'actualité chaude.

## 2. Analyse concurrentielle (recherche directe, sept. 2026)

| Concurrent | Modèle | Ce qui génère son trafic SEO | Ce qu'on doit copier |
|---|---|---|---|
| **IG Academy** (ex-DailyFX education, UK) | Broker / conformité | Cours par niveau (débutant → avancé), quiz, sessions live, **bibliothèque de webinaires**, hub vidéo, articles ; DailyFX a été **fusionné dans l'Academy** | Structurer nos webinaires en **parcours** (« Niveau 1 : bases », « Niveau 2 : risque ») + quiz de fin de guide |
| **TradingSat / BFM Bourse** (FR) | Média + abonnement « Prestige » | **Pages programmatiques massives** : cotations A-Z, palmarès, agenda économique, introductions en bourse, transactions des dirigeants, ETF ; comparateur de courtiers **noté** ; lexique ; forum ; jeu boursier ; newsletter | Glossaire, pages « marché/actif », comparateurs notés, agenda économique evergreen, jeu/quiz comme aimant à liens |
| **ABC Bourse** (FR) | Média + premium | Pages FAQ évergreen (« Qu'est-ce qu'une action ? », « Comment lire un graphique ? », « Qu'est-ce que l'analyse technique ? »), lexique boursier, **quizz bourse**, backtest manager, points pivots, palmarès PER, **consensus des membres** (UGC), comparateur courtiers | Transformer chaque notion en page FAQ autoportante + ajouter une couche UGC (avis/consensus/commentaires indexés) |
| **stock3 / godmode-trader** (DE) | Abonnement + brokers | Analyses signées **par des auteurs identifiés avec photo**, tags thématiques (« Im Fokus : KI, Inflation »), news live, séminaires/événements, **trading intégré depuis l'article** | Auteurs nommés/référencés, pages auteur, tags thématiques cliquables |
| **Bolsamania** (ES) | Média + éditions pays | Cotation par ticker, **changements de recommandation** (tableaux de brokers), « Autores » (pages auteur), TV, formation, **éditions CAT/MEX/AR/PE/CO/CL** | Pages auteur + une déclinaison par marché/monnaie au lieu d'une traduction identique |
| **Moneycontrol Hindi** (HI) | Média + PRO | Très forte **vélocité**, pages par action, « एजुकेशन », web stories (Google Discover), portefeuille connecté | Vélocité régulière + formats Discover (grande image, actualité pédagogique) |
| **MQL5** (11 langues) | UGC + incentives | 85 pages d'articles classés par catégories, **contributions payées** (200 $/article), profils auteurs réputés, forum, codebase — et même un appel explicite à devenir « source préférée dans Google » | Ouvrir la plateforme à des **contributeurs externes** (rédacteurs traders) avec attribution + profil |

**Enseignements transverses** : (1) tout le monde gagne avec des **pages
programmatiques + données** ; (2) personne ne gagne durablement sans
**auteurs identifiables** ; (3) la **communauté/UGC** est le seul levier qui
scale en contenu sans coût linéaire ; (4) le **multi-pays** se fait par URL, pas
par cookie.

## 3. Audit de notre SEO actuel (état du code)

### Déjà en place (solide)

| Élément | Où |
|---|---|
| Pages publiques rendues **côté serveur** (contenu indexable) | `app/**/page.tsx` (Server Components) |
| `sitemap.xml` dynamique (pages statiques + analyses + rapports + webinaires, `lastModified` réel) | `app/sitemap.ts` |
| `robots.txt` dynamique (bloque `/admin`, `/espace-membre`, `/connexion`, `/api/`) | `app/robots.ts` |
| Canonical + Open Graph sur l'accueil et les pages de détail | `app/page.tsx`, `app/analyses/[slug]/page.tsx`, `app/rapports/[slug]`, `app/webinaires/[slug]` |
| JSON-LD `Article`, `Event`, `Report` | pages de détail |
| `noindex` sur les pages privées/transactionnelles | `/connexion`, `/newsletter/*` |
| URLs propres, sans paramètre ; 308 `/analyses/<guide>` → `/guides/<slug>` | `app/analyses/[slug]/page.tsx` |
| Contenu 100 % gratuit (`isAccessibleForFree: true`) | JSON-LD |
| Consentement cookies + analytics first-party (RGPD) | `CookieConsent`, `AnalyticsTracker` |
| 8 langues + RTL, `<html lang/dir>` correct | `lib/i18n/*` |

### Faiblesses bloquantes (par ordre d'impact)

1. **Une seule URL pour 8 langues** (`te_lang` cookie) → pas de `hreflang`, pas
   de sitemap par langue, indexation monolingue (`app/layout.tsx`).
2. **Guides sans métadonnées** : `app/guides/page.tsx` et `app/guides/[id]/page.tsx`
   commencent par `"use client"` et n'exportent **ni `metadata` ni
   `generateMetadata`** → title générique, aucune description, aucun canonical,
   aucun JSON-LD sur nos 10 pages évergreen les plus recherchées.
3. **Pas de fil d'Ariane** (ni UI, ni `BreadcrumbList`) → moins de rich results et
   maillage interne plus pauvre.
4. **Pas d'auteurs** : JSON-LD `author` = `Organization` générique, aucune page
   auteur, aucune bio, aucune politique éditoriale → signal E-E-A-T faible en YMYL.
5. **`dynamic = "force-dynamic"` partout** (accueil, détail, sitemap) → pas de
   cache/CDN, TTFB élevé, budget de crawl gaspillé à grande échelle.
6. **Types JSON-LD partiellement invalides** : `Report` n'existe pas dans
   schema.org ; absents : `Organization`, `WebSite` + `SearchAction`, `FAQPage`,
   `HowTo`, `ItemList`, `Course`.
7. **Aucune image** (`next/image` : 0 occurrence) → pas d'`og:image`, pas de
   Discover (visuels larges ≥ 1 200 px), CTR SERP plus faible.
8. **Programmatique inexistant** : aucune page par notion, par indicateur, par
   actif, aucun glossaire, aucun comparateur noté — le moteur n°1 des concurrents.
9. **Pas de flux RSS**, pas d'**IndexNow** (Bing/Yandex), pas de balise de
   vérification Search Console.
10. **Pages filtrées/paginées indexables** (`?q=`, `?categorie=`, `?page=`) sans
    gestion canonical/robots → contenu dupliqué et crawl inutile.
11. **Contenus FR/EN seulement** pour les pages historiques (`/a-propos`,
    `/mentions-legales`, `/politiques`, `/outils`, `/ressources`, `/recap`, guides).
12. **Aucun backlink actif** : pas de relations presse, pas de contenu « citable »
    (études de données), pas d'UGC qui attire naturellement des liens.

## 4. Les trois chantiers structurants

### Chantier A — Internationalisation indexable (URL + hreflang) — PRIORITÉ 1

| Option | URLs | Avantages | Inconvénients |
|---|---|---|---|
| **A1. Sous-dossiers** (recommandé) | `tradingeducationpro.com/fr/...`, `/en/...`, `/de/...` | Conserve l'autorité du domaine, mesure par dossier dans Search Console, un seul déploiement | Migration d'URL (301 à poser) |
| **A2. Sous-domaines** | `fr.`, `en.`, `de.tradingeducationpro.com` | Isolation par marché, utile si contraintes réglementaires locales | Autorité partagée, DNS/certificats, deux déploiements |

Mise en œuvre A1 :

1. Déplacer les routes publiques sous `app/[locale]/...` ; `/` redirige (302/301)
   vers la langue détectée, avec un « x-default » servi en anglais.
2. `generateStaticParams()` sur les 8 langues + `alternates.languages` dans chaque
   `generateMetadata` (Next génère les `<link rel="alternate" hreflang>`), plus
   `x-default` → `/en/`.
3. Sitemap index + un sitemap par langue (`/sitemap-fr.xml`, `/sitemap-en.xml`…)
   avec les alternates par URL.
4. Redirections 301 depuis les URLs actuelles ; le cookie `te_lang` ne sert plus
   qu'à la préférence d'affichage (jamais à l'indexation).
5. `og:locale` (+ `og:locale:alternate`), `content-language` cohérents.
6. Traduire les slugs là où le gain est réel (`/de/analysen`, `/es/analisis`) :
   +15–30 % de CTR, au prix d'une table de correspondance à maintenir.

### Chantier B — E-E-A-T / YMYL (finance = sujet sensible)

1. Modèle `Author` (nom, photo, bio multilingue, années d'expérience, `sameAs`
   LinkedIn/X, spécialités) + liaison auteur ↔ contenus.
2. Pages publiques d'auteur (`/auteurs/<slug>` / `/authors/<slug>`) avec
   `Person` JSON-LD et la liste de ses publications.
3. Bloc « À propos de l'auteur » en fin d'article, mention « Relu par », date de
   dernière revue ; `author` + `reviewedBy` en JSON-LD.
4. Pages de confiance : politique éditoriale, méthodologie, sources de données,
   contact, corrections — reliées en `sameAs` depuis l'`Organization`.
5. Encadré risque/non-conseil normalisé (déjà présent) + transparence sur
   l'affiliation des plateformes partenaires.

### Chantier C — Programmatique & outils comme aimants

| Type de page | Exemple d'URL | Volume visé | Schema |
|---|---|---|---|
| Glossaire | `/de/lexikon/rsi`, `/es/glosario/apalancamiento` | 200–400 × langue | `DefinedTerm` |
| Clusters d'indicateurs | `/guides/rsi/divergence` | 30–60 × langue | `Article` + `FAQPage` |
| Outils enrichis | `/outils/calculatrice-taille-position` (+ FAQ/HowTo) | 4–12 × langue | `HowTo` + `SoftwareApplication` |
| Comparateurs notés | `/courtiers/<nom>-avis`, `/prop-firms/<nom>` | 20–60 | `Review` + `AggregateRating` |
| Marchés / actifs | `/marches/eur-usd`, `/marches/bitcoin` (contexte pédagogique) | 30–80 | `Article` + `Dataset` |
| Calendrier macro | `/calendrier/nfp`, `/calendrier/fomc` | 20–40, rafraîchis | `Article` + `Event` |
| Pages auteur | `/auteurs/<slug>` | 5–20 | `Person` |
| Replays | `/webinaires/<slug>` + transcription | croissant | `Event` + `VideoObject` |

Ordre de production : glossaire → outils (FAQ/HowTo) → clusters guides →
comparateurs notés → marchés/calendrier.

## 5. Feuille de route priorisée

### P0 — Fondations (semaines 1 à 4) — impact fort, effort faible/moyen

| # | Action | Impact | Effort | Fichiers |
|---|---|---|---|---|
| 1 | JSON-LD de site : `Organization` + `WebSite` (+ `SearchAction`) | Moyen | 2 h | `components/seo/JsonLd.tsx`, `app/layout.tsx` |
| 2 | Fil d'Ariane visible + `BreadcrumbList` sur les pages de détail | Moyen | 4 h | `components/Breadcrumbs.tsx`, pages détail |
| 3 | Corriger le type `Report` (→ `DigitalDocument`/`Article` + `encodingFormat`) | Faible | 1 h | `app/rapports/[slug]/page.tsx` |
| 4 | `metadata` des guides via enveloppe serveur + `generateMetadata` | **Fort** | 1–2 j | `app/guides/*` (split client/serveur) |
| 5 | Métadonnées par défaut : OG/Twitter, `robots`, vérifications GSC/Bing via env | Moyen | 2 h | `app/layout.tsx` |
| 6 | Flux RSS (`/feed.xml`) + `alternates.types` | Faible | 2 h | `app/feed.xml/route.ts` |
| 7 | Canonical/noindex sur listes filtrées et paginées (`?q=`, `?page=`) | Moyen | 3 h | `app/analyses/page.tsx`, `app/rapports/page.tsx` |
| 8 | ISR au lieu de `force-dynamic` (accueil 300 s, détail 3600 s) | Fort (CWV/crawl) | 3 h | `app/page.tsx`, `app/**/[slug]/page.tsx` |
| 9 | Search Console + Bing Webmaster + GA4/Matomo branchés, sitemap soumis | — (mesure) | 1 j | ops |
| 10 | `og:image` générique par gabarit (`opengraph-image.tsx`, ImageResponse) | Moyen | 1 j | `app/opengraph-image.tsx` |

### P1 — Internationalisation + E-E-A-T (mois 2–3)

| # | Action | Impact | Effort |
|---|---|---|---|
| 11 | Migration `app/[locale]/...` + `hreflang` + 301 + sitemaps par langue | **Très fort** | 1–2 semaines |
| 12 | Modèle `Author` + pages auteur + blocs auteur/`Person` JSON-LD | **Très fort** (YMYL) | 1 semaine |
| 13 | Pages de confiance (politique éditoriale, méthodo, sources, corrections) | Fort | 3–4 j |
| 14 | Glossaire programmatique (première vague : 60 termes × 8 langues) | **Très fort** | 2 semaines |
| 15 | FAQ/HowTo sur les 4 outils + `SoftwareApplication` | Fort | 3–4 j |
| 16 | Traduction des pages historiques (au minimum ES/DE/IT) ou `noindex` si non traduites | Moyen | 1 semaine |
| 17 | IndexNow (clé + ping à la publication) | Moyen | 1 j |
| 18 | Images : visuels de gabarit (1200×630) + `next/image`, attributs `width/height` | Moyen | 3–4 j |

### P2 — Volume & autorité (mois 4–6)

| # | Action | Impact |
|---|---|---|
| 19 | Clusters guides (sous-pages « divergence RSI », « taille de position en forex »…) | Très fort |
| 20 | Comparateurs notés (`Review`) : courtiers, prop firms, convertisseurs | Fort + revenus affilés |
| 21 | Pages marchés/actifs pédagogiques + pages événements macro rafraîchies | Fort |
| 22 | Programme de contributeurs (auteurs invités traders) avec attribution | Fort (volume + autorité) |
| 23 | Études de données « linkables » (ex. « coût réel du levier sur 5 ans ») + relations presse | Fort (netlinking) |
| 24 | Transcription + `VideoObject` pour chaque replay de webinaire | Moyen |
| 25 | Tests A/B titres/H1, enrichissement des pages qui rankent en position 5–15 | Moyen |

### P3 — Optimisation continue (mois 7–12)

- Rafraîchissement programmé des pages (revue trimestrielle, `dateModified`).
- Déclinaisons par marché (monnaie, horaires, fiscalité) plutôt que traductions identiques.
- Structured data avancés : `Course` + `Quiz`, `Dataset` pour les séries macro.
- Déduplication sémantique inter-langues (éviter les traductions littérales).
- Roadmap CWV fine : préchargement conditionnel des widgets, budget JS par gabarit.

## 6. Playbook contenu

**Gabarit d'article « guide/notion » (celui qui ranke)** :
1. H1 = requête cible + réponse en 40 mots (« Answer-first »).
2. Sommaire cliquable (ancre), 6 à 10 H2, H3 sous chaque H2 (structure = featured snippets).
3. Définitions, formule, exemple chiffré, capture/schéma, erreurs fréquentes.
4. Encadré « À retenir » (liste à puces de 5 points) + questions/réponses
   `FAQPage` en fin de page (3–5 Q/R rédigées en langage naturel).
5. Maillage : 3 liens sortants contextuels (guide lié, outil, rapport) + 3 liens
   entrants programmés depuis d'autres articles.
6. Auteur, date de publication, date de dernière revue, sources.

**Rythme de production réaliste** (avec 1 rédacteur + 1 traducteur/éditeur) :

| Mois | Pages nouvelles | Traductions | Total cumulé indexable |
|---|---|---|---|
| 1 | 8 (clusters guides + FAQ outils) | — | ~70 |
| 2 | 10 | 60 termes de glossaire | ~150 |
| 3 | 10 | 60 termes | ~240 |
| 4–6 | 30 (comparateurs, marchés, calendrier) | 120 | ~450 |
| 7–12 | 60–90 | 200+ | **1 200–1 500** |

**Priorités de mots-clés** (à valider avec Search Console) :

1. **Outils + calcul** (intention forte, conversion membre) : « calculateur taille de
   position », « position size calculator », « risk reward rechner », « calculadora
   apalancamiento »…
2. **Notions/indicateurs** (volume + évergreen) : « RSI divergence », « Ichimoku
   nuage », « money management forex », « stop loss »…
3. **Comparatifs** (revenus affilés) : « meilleur courtier », « prop firm
   comparaison », « broker avec le plus petit spread »…
4. **Marchés/événements** (volume + fraîcheur) : « EUR USD analyse », « NFP »,
   « calendrier FOMC »…
5. **Marque** (défensif) : « Trading Education avis », « Trading Education guides ».

## 7. Netlinking (autorité)

| Tactique | Détail | Coût | Délai |
|---|---|---|---|
| Études de données | 1 par trimestre : analyse interne (ex. « 5 ans de coûts de levier »), page + visuel + communiqué | Interne | 1 mois |
| Relations presse | 5–10 médias finance/sport finance par mois (FR puis EN/DE/ES) | Faible (temps) | 2–3 mois |
| Outils « linkables » | Un outil gratuit mis en avant par des forums/Reddit/Quora (calculateurs) | Faible | 1–3 mois |
| Contributeurs invités | Traders/formateurs publient avec lien vers leur profil | Faible | Continu |
| Partenariats | Échanges d'articles avec nos 5 partenaires actuels (contenus co-signés) | Faible | 1 mois |
| Annuaires & citations | Fiches de marque (Crunchbase-like, annuaires finance, profils auteur) | Faible | 1 mois |
| UGC | Commentaires modérés indexés, consensus/avis membres, quiz partageables | Moyen | 3 mois |

**À éviter** (pénalisant) : fermes de liens, échanges massifs, achat de liens
avec exact-match anchor, contenu généré à la chaîne sans relecture, empilement
de mots-clés — en YMYL finance, Google sanctionne plus vite qu'ailleurs.

## 8. Technique, performance et mesure

- **Core Web Vitals** : widgets TradingView/CoinMarketCap chargés à l'interaction
  (ou après consentement), `next/font` déjà en place, éviter les images non
  dimensionnées ; cible LCP < 2,5 s, INP < 200 ms, CLS < 0,1.
- **Cache** : ISR (`revalidate`) + en-têtes `Cache-Control` immuables sur `/_next/static`,
  CDN devant l'app (Coolify/Traefik + Cloudflare) et compression Brotli.
- **Crawl** : sitemaps par langue, `lastModified` exacts, `robots.txt` propre,
  pas de paramètres indexables, pas d'erreurs 5xx (surveillance).
- **International** : `hreflang` réciproques, `x-default`, `og:locale`,
  pas de redirection automatique basée sur l'IP (porter la préférence en bannière).
- **Outils** : Google Search Console (8 propriétés ou dossiers), Bing Webmaster,
  GA4 (ou Plausible/Matomo si on reste consenti-only), Ahrefs/Semrush (1 licence),
  Screaming Frog (crawl mensuel), PageSpeed Insights / CrUX.

**KPI à suivre chaque mois** :

| KPI | Base (aujourd'hui) | 6 mois | 12 mois |
|---|---|---|---|
| Pages indexées | ~50 | 400 | 1 200+ |
| Requêtes positionnées (top 100) | à mesurer | 3 000 | 15 000 |
| Clics organiques / mois | à mesurer | 5 000 | 30 000 |
| Domaines référents | ~0 | 40 | 150 |
| Inscriptions issues de l'organique / mois | à mesurer | 150 | 900 |
| CWV « Bon » (mobile) | à mesurer | 80 % | 95 % |

## 9. Ressources et budget indicatif (annuel)

| Poste | Option interne | Option agence | Commentaire |
|---|---|---|---|
| Rédaction (FR + EN) | 1 rédacteur finance | 0,10–0,20 €/mot | 8–12 articles/mois = 25–40 k mots |
| Traduction éditoriale (ES/DE/IT/HI/AR/RU) | 1 traducteur freelance | 0,07–0,12 €/mot | Traduction *adaptée*, pas littérale |
| SEO technique | Cline / dev interne | 1 500–4 000 €/mois | Migration i18n, schémas, CWV |
| Netlinking / RP | interne (temps) | 2 000–6 000 €/mois | Priorité aux études de données et RP |
| Outils | Ahrefs ou Semrush | — | 100–200 €/mois |
| Design/visuels | interne | — | Visuels Discover 1200×630 + schémas |
| **Total mensuel réaliste** | **~2–4 k€** | **~8–15 k€** | Démarrage léger, montée en charge sur 6 mois |

## 10. Déjà implémenté (P0 partiel — cette itération)

| Livré | Fichier | Effet |
|---|---|---|
| JSON-LD de site `Organization` + `WebSite` + `SearchAction` | `lib/seo.ts`, `components/seo/JsonLd.tsx`, `app/layout.tsx` | Identité de marque, encadré de recherche, signaux de confiance |
| Fil d'Ariane visible + `BreadcrumbList` | `components/Breadcrumbs.tsx` + pages de détail analyses/rapports/webinaires | Rich result, maillage interne, repère utilisateur |
| Type `Report` corrigé → `Article` + `encodingFormat: application/pdf` | `app/rapports/[slug]/page.tsx` | Données structurées valides |
| `author`/`reviewedBy` factorisés (`authorJsonLd`) | `lib/seo.ts` | Socle pour le chantier E-E-A-T |
| Flux RSS 2.0 (`/feed.xml`, `?lang=`) + `<link rel="alternate">` | `app/feed.xml/route.ts`, `app/layout.tsx` | Découverte/agrégation, indexation rapide |
| Image Open Graph 1200×630 générée | `app/opengraph-image.tsx` | Partage social + Discover, plus de « pas d'image » |
| `og:*` par défaut, `twitter:card`, `themeColor`, `applicationName` | `app/layout.tsx` | SERP sociales propres |
| Directives `robots` (max-image-preview:large, snippet complet) | `app/layout.tsx` | Aperçus larges autorisés |
| Vérifications GSC/Bing/Yandex via variables d'environnement | `app/layout.tsx` | Prêt pour la mise en service (`GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`, `YANDEX_SITE_VERIFICATION`) |
| `robots.txt` : pages transactionnelles exclues + crawlers IA explicités | `app/robots.ts` | Crawl propre, citations IA autorisées |
| Canonical auto-référent par page + `noindex` sur les filtres internes | `app/analyses/page.tsx`, `app/rapports/page.tsx` | Plus de duplication par paramètres d'URL |
| Tests automatisés SEO | `scripts/test-seo.mjs` (`npm run test:seo`) | Non-régression : robots, RSS, schémas, canonical, OG image |

## 11. Décisions à prendre (pour la suite immédiate)

1. ~~**Stratégie d'URL multilingue**~~ ✅ **tranché : option A1 (sous-dossiers)** —
   migration livrée, voir §12.
2. **Auteurs** : fournir les profils (nom, bio, photo, références) pour créer les
   pages auteur et les blocs E-E-A-T. *(En attente — sera fourni prochainement.)*
3. **Priorités de contenu** : valider l'ordre glossaire → outils → clusters
   guides → comparateurs (et l'objectif de 8–12 publications/mois).
4. **Budget/équipe** : interne (2–4 k€/mois) ou hybride avec agence SEO
   (8–15 k€/mois) — l'arbitrage conditionne la vitesse d'exécution.
5. **Contenus historiques FR/EN** : traduire ou `noindex` dans les 6 autres langues.

## 12. Migration multilingue livrée (option A1)

**Schéma d'URL** : les pages publiques vivent sous `/{langue}/...`
(fr, en, es, de, it, hi, ar, ru). Les zones privées et transactionnelles restent
hors préfixe.

| Élément | Mise en œuvre |
|---|---|
| Routage | `middleware.ts` : langue lue dans l'URL → en-tête `x-te-locale` ; URL historique sans préfixe → **308** vers la version localisée (cookie `te_lang` sinon défaut) ; préfixe inconnu (`/xx/...`) → 404 |
| Langue côté serveur | `getLang()` lit l'en-tête (URL) puis le cookie (`lib/i18n.ts`) — **aucune page n'a été réécrite** : toutes continuent d'appeler `getLang()` |
| Alternates | `localizedAlternates(lang, path)` → canonique auto-référent + `hreflang` des 8 langues + `x-default` (`lib/i18n/locale-path.ts`) |
| Liens internes | `components/Link.tsx` remplace `next/link` (34 fichiers) : `/analyses` devient automatiquement `/fr/analyses`, `/de/analyses`… Les chemins privés/techniques ne sont jamais préfixés |
| Segments | `app/[locale]/...` + `generateStaticParams` (8 langues) et `dynamicParams = false` (404 sur locale inconnue) |
| Sitemaps | `/sitemap.xml` = index ; `/sitemaps/{langue}/sitemap.xml` = `urlset` d'une langue avec `xhtml:link rel="alternate" hreflang` sur chaque URL |
| Flux RSS | `/feed.xml?lang=xx` avec liens localisés |
| Emails | liens vers la version linguistique du destinataire (`withLocale`) |
| Contexte client | l'URL fait foi : `LangProvider` reprend la langue du serveur, le cookie/localStorage ne sert plus qu'à la redirection des anciennes URLs |
| Analytics | le préfixe de langue est retiré du chemin mesuré (statistiques par page, toutes langues confondues) |
| Tests | `npm run test:i18n` (langue, `dir`, hreflang, canonique, 308, 404, 14 pages × 8 langues) et `npm run test:seo` (sitemaps index/enfants, alternates, OG image) |

**Ajouter une langue** : ajouter l'entrée dans `LANGUAGES`
(`lib/i18n/languages.ts`) + le dictionnaire `lib/i18n/dict/<code>.ts` →
les URLs `/xx/...`, les `hreflang` et les sitemaps sont générés automatiquement.

**Redirection en production** : à activer côté hébergeur si un CDN est placé
devant l'application (Coolify/Traefik passe déjà par le middleware Next).





