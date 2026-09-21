# Plan d'implémentation — plateforme membres & contenus (Trading Education)

> Objectif : passer d'un site vitrine statique à une plateforme média complète
> (analyses, rapports PDF, webinaires, comptes membres, emails) **sans paywall,
> sans paiement et sans donnée bancaire**.

## 1. Stack retenue (et pourquoi)

| Besoin | Choix | Justification |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | Déjà en place, SEO natif, streaming serveur, coût nul |
| Langage / UI | **TypeScript + TailwindCSS** | Déjà en place, cohérent avec tradingeducationpro.com |
| Base de données | **PostgreSQL** | Éprouvé, gratuit, scalable (auto-hébergé Coolify **ou** Supabase) |
| ORM | **Prisma 6** | Migrations versionnées, types TS générés, `studio` pour l'admin |
| Authentification | **NextAuth v4 + adaptateur Prisma** | Standard de l'écosystème Next.js, JWT signé, rôles |
| Mots de passe | **bcryptjs** (10 rounds) | Hachage éprouvé, pur JS (aucune compilation native) |
| Emails | **Resend (API HTTP, `fetch`)** | Palier gratuit 3 000 emails/mois, sans SDK, journalisé en base |
| Fichiers (PDF/images) | **Disque local (`STORAGE_DIR`, volume Coolify)** | Gratuit ; compatible URL externe (Supabase Storage/S3) si besoin |
| Analytics | **Table `AnalyticsEvent` en base + beacon navigateur** | Aucun outil tiers payant, RGPD (IP hachée, consentement) |
| SEO | Métadonnées Next + **JSON-LD Article/Event/Report** + sitemap dynamique | Indexation totale, aucun contenu derrière un mur |
| Validation | **Zod** | Déjà en place, réutilisé côté client et serveur |

> Variante « WordPress » : Ultimate Member + Download Monitor + The Events Calendar.
> Elle a été écartée : le site existant est un Next.js sur mesure (widgets TradingView,
> outils, AdSense, i18n) et une migration WordPress coûterait plus cher à maintenir
> tout en dégradant les performances SEO actuelles.

**Coût d'exploitation cible** : 0 € – 10 €/mois (Postgres sur le même serveur Coolify,
Resend palier gratuit, stockage sur volume disque). Aucune dépendance payante.

## 2. Rôles et accès

| Rôle | Peut faire |
|---|---|
| **Visiteur** | Lire 100 % du contenu (analyses, rapports PDF, pages webinaires, replays), s'abonner à la newsletter, s'inscrire à un webinaire avec son email |
| **Membre inscrit** (`MEMBER`) | Tout le visiteur + commenter, historique des téléchargements, préférences email, export/suppression de ses données |
| **Rédacteur** (`EDITOR`) | Administration des **contenus uniquement** : analyses, rapports PDF, webinaires, modération des commentaires, upload de fichiers, statistiques de contenu. **Pas d'accès** aux inscrits, aux exports CSV ni aux campagnes email |
| **Administrateur** (`ADMIN`) | Tout, y compris inscrits + export CSV, campagnes email, journal des emails, statistiques complètes (dont entonnoir de conversion) |

Aucun niveau premium, aucun paiement, aucun stockage de moyen de paiement.

**Matrice d'accès appliquée** (source : `lib/roles.ts`)

| Route / API | MEMBER | EDITOR | ADMIN |
|---|---|---|---|
| `/espace-membre*` | ✅ | ✅ | ✅ |
| `/admin`, `/admin/articles*`, `/admin/rapports*`, `/admin/webinaires*`, `/admin/commentaires` | ❌ | ✅ | ✅ |
| `/admin/abonnes`, `/admin/emails` | ❌ | ❌ (redirigé vers `/admin`) | ✅ |
| `POST /api/admin/upload`, CRUD `/api/admin/{articles,rapports,webinaires}`, `PATCH /api/admin/commentaires` | ❌ (403) | ✅ | ✅ |
| `GET /api/admin/abonnes` (CSV), `GET/POST /api/admin/emails` | ❌ (403) | ❌ (403) | ✅ |

La navigation de l'administration (`AdminShell`) et le tableau de bord s'adaptent au
rôle : le rédacteur ne voit que les rubriques de contenu et les statistiques associées.

Le compte rédacteur est créé par le seed (`EDITOR_EMAIL` / `EDITOR_PASSWORD`,
par défaut `redacteur@tradingeducationpro.com` / `Redacteur123!`) ; le rôle se
modifie ensuite en base (`UPDATE "User" SET role='EDITOR' WHERE email='…';`).

## 3. Phase 1 — livrée dans ce dépôt

1. **Modèle de données complet** (`prisma/schema.prisma`) : utilisateurs & rôles,
   abonnés newsletter, catégories, tags, articles, rapports + téléchargements,
   webinaires + inscriptions, commentaires, journaux d'emails, campagnes, analytics.
2. **Authentification & RBAC** : inscription gratuite, connexion, mot de passe
   oublié/réinitialisation, middleware de protection `/espace-membre` et `/admin`.
3. **Contenu public** : `/analyses`, `/rapports`, `/webinaires` (listes + pages
   détail, recherche, catégories, contenus associés, JSON-LD).
4. **Téléchargements tracés** (`/api/rapports/[slug]/telecharger`), **inscriptions
   webinaires**, **commentaires modérés**, **newsletter double opt-in**.
5. **Espace membre léger** : tableau de bord, historique des téléchargements,
   webinaires à venir, préférences email, export JSON (RGPD), suppression de compte.
6. **Administration** : tableau de bord statistiques, CRUD analyses/rapports/webinaires,
   upload PDF et images, inscrits + export CSV, campagnes email + tests, modération.
7. **Emails** : bienvenue, confirmation newsletter, confirmation webinaire, rappel
   webinaire, nouveau rapport, newsletter hebdomadaire (templates HTML + journalisation).
8. **SEO / Analytics / RGPD** : sitemap dynamique, robots, bannière de consentement,
   page confidentialité, statistiques internes (vues, téléchargements, inscriptions,
   taux de conversion).
9. **Industrialisation** : Dockerfile mis à jour (génération Prisma, volume `/app/storage`),
   `.env.example`, documentation.

## 4. Phase 2 — livrée : migration des guides + bloc éditorial (voir §4 bis)

## 4 bis. Phase 2 livrée

**Import des 10 guides historiques dans la base** :
`npm run db:import-guides` (`scripts/import-guides.mjs`) parse
`app/guides/[id]/page.tsx` (contenus EN + FR) et `app/guides/page.tsx`
(descriptions de repli), puis crée/met à jour un `Article` publié par guide
(catégorie `guides-education`, tags normalisés, temps de lecture calculé).
L'opération est **idempotente** : relançable à chaque mise à jour des guides.

**Pas de contenu dupliqué (SEO)** :
- `/guides/<slug>` reste **l'URL canonique** des guides ;
- `/analyses/<guide>` fait une **redirection permanente (308)** vers `/guides/<slug>` ;
- dans les listes `/analyses` et sur l'accueil, les guides s'affichent avec un
  badge « Guide » et pointent directement vers `/guides/<slug>` ;
- `app/sitemap.ts` liste les guides sous `/guides/<slug>` (et non `/analyses/…`).

**Bloc éditorial sur la page d'accueil** (indexable, maillage interne) :
- `app/page.tsx` est un **Server Component** (métadonnées + canonique) qui rend
  `HomeClient` (composant client existant : widgets, AdSense) et lui injecte
  `<LatestContent />` comme *slot* — le HTML du bloc est donc rendu côté serveur ;
- `components/LatestContent.tsx` affiche les 3 dernières analyses, le dernier
  rapport PDF (avec compteur de téléchargements), le prochain webinaire, 3 guides
  et un formulaire de newsletter.

**Maillage interne complémentaire** : chaque page de guide propose un bloc
« Pour aller plus loin » vers `/analyses`, `/rapports`, `/webinaires` et
`/inscription`.

## 5. Phase 3 — livrée (rôles, fuseaux, emails bilingues, parité FR)

### 5.1 Rôle « rédacteur » (`EDITOR`)

- Enum `UserRole` étendue (`VISITOR`, `MEMBER`, `EDITOR`, `ADMIN`) — voir `lib/roles.ts`.
- Middleware (`middleware.ts`) : filtrage par section (`canAccessAdminPath`).
- Formulaires d'API : `requireContentManager()` (contenus, upload, modération)
  vs `requireAdmin()` (inscrits, campagnes).
- Pages protégées côté serveur (`/admin/abonnes`, `/admin/emails`) : redirection
  vers `/admin` si le rôle n'est pas `ADMIN`.
- Interface adaptative : menu filtré et tableau de bord allégé pour l'éditeur.

### 5.2 Fuseau horaire du visiteur

- Cookie first-party `te_tz` renseigné par `components/TimezoneSync.tsx`
  (`Intl.DateTimeFormat().resolvedOptions().timeZone`) puis validé côté serveur
  (`normalizeTimezone`, repli `Europe/Paris`).
- `formatDate` / `formatDateTime` utilisent ce fuseau par défaut ; un fuseau
  explicite reste possible (ex. emails = fuseau du webinaire).
- Les pages webinaires affichent l'heure locale **et** l'abréviation du fuseau
  (`UTC+2`, `UTC−4`, `UTC+9`), tout en rappelant le fuseau de référence de la session.

### 5.3 Emails bilingues FR/EN

- Chaque gabarit (`lib/email-templates.ts`) accepte `locale` et fournit objet,
  titres, corps, appels à l'action, pied de page et lien de désinscription dans
  les deux langues (`<html lang>` correct, aucun texte mixte).
- La langue provient de : `User.locale` (compte), `Subscriber.locale` (newsletter,
  alertes rapports), `WebinarRegistration.locale` (ajouté au schéma), sinon du
  cookie `te_lang` du navigateur ; les envois de masse suivent la locale de chaque
  destinataire.
- L'inscription au site reprend la langue du navigateur et l'enregistre sur le compte.
- Emails couverts : bienvenue, confirmation newsletter, réinitialisation de mot de
  passe, confirmation de webinaire, rappel de webinaire, nouveau rapport, synthèse
  hebdomadaire, campagnes.

### 5.4 Contenus FR à parité

- Nouveau module `app/guides/guides-fr-extended.ts` (9 guides réécrits en français
  complet, structure identique à l'anglais : calcul, principes, workflow, stratégies,
  checklists, erreurs fréquentes).
- Fusion dans `app/guides/[id]/page.tsx` (l'étendu prime sur les versions courtes
  historiques) et dans la liste `app/guides/page.tsx`.
- Le script `npm run db:import-guides` lit ce module : les 10 articles ont désormais
  un `contentHtmlFr` complet (> 2 500 caractères).
- **Rendu serveur dans la bonne langue** : `LangProvider` reçoit `initialLang` du
  cookie `te_lang` (lu dans `app/layout.tsx`), ce qui élimine le rendu anglais par
  défaut du HTML initial et améliore l'indexation des pages françaises.

### 5.5 Refonte de la page d'accueil (tout en cartes)

- Composants UI réutilisables : `components/home/FeatureCard.tsx` (icône, badge,
  titre, description, étiquettes, appel à l'action, carte interne ou externe) et
  `components/home/SectionHeading.tsx` (+ `CardGrid`).
- Bandeau de compteurs rendu **côté serveur** (`components/home/HomeStats.tsx` sur
  `getHomeStats()`) : analyses, guides, rapports PDF, webinaires, outils.
- Ordre des blocs : bandeau d'accueil compact (titre + accroche, **sans boutons**)
  → compteurs → **rubriques de la plateforme (8 cartes)** → **dernières publications
  (analyses + ressources & live)** → marché en direct (ticker + graphique + screener
  + heatmap + texte éditorial) → outils (4 cartes) → guides (4 cartes) → partenaires
  (5 cartes) → transparence (3 cartes) → appel à l'action final.
- `components/Hero.tsx` : bandeau réduit (`py-8 md:py-10`, titre `2xl/3xl`, dégradé
  horizontal) et boutons supprimés — les appels à l'action sont déjà dans les cartes.
- Les rubriques sont placées **avant** le bloc éditorial pour une entrée en matière
  immédiate sur les fonctionnalités du site.
- `app/page.tsx` injecte les blocs serveur dans le composant client :
  `<HomeClient stats={<HomeStats />} editorial={<LatestContent />} />` — contenu
  indexable (SEO + AdSense) tout en conservant les widgets interactifs.
- Emplacements AdSense (banner + rectangle) conservés.

### 5.6 Interface en 8 langues (fr, en, es, de, it, hi, ar, ru) + RTL

- **Métadonnées** : `lib/i18n/languages.ts` (module pur, client + serveur) décrit
  chaque langue — code, libellé natif, drapeau, balise `Intl`, sens de lecture.
  `normalizeLang()` accepte `fr`, `FR`, `fr-FR`, `ar-SA`… et retombe sur le
  français si le code n'est pas supporté.
- **Traductions** : `lib/i18n/dict/` (un fichier par langue, typés par `Dict`).
  TypeScript interdit d'oublier une clé : ajouter une entrée au dictionnaire
  oblige à renseigner les 8 langues. Les composants clients importent
  `@/lib/i18n/dict` (module pur, sans `next/headers`) ; les Server Components
  utilisent `@/lib/i18n`.
- **Sélecteur** : `components/Header.tsx` (liste déroulante 🌐 avec les libellés
  dans leur langue). Le choix est stocké dans le cookie `te_lang` **et** le
  `localStorage`, appliqué à `<html lang/dir>` puis `router.refresh()` re-rend les
  pages serveur dans la nouvelle langue.
- **RTL (arabe)** : `<html dir="rtl">` est posé côté serveur (layout) et côté
  client (LangProvider) ; les composants partagés (en-tête, pied de page, cartes,
  popup) utilisent les utilitaires logiques Tailwind (`ps-*`, `pe-*`, `ms-*`,
  `start-*`, `end-*`) et les flèches se retournent via `rtl:-scale-x-100`.
  `app/globals.css` corrige les espacements physiques du contenu riche
  (`prose-custom`, `info-box`).
- **Dates et nombres** : `formatDate` / `formatDateTime` / `formatNumber`
  utilisent la locale de la langue choisie (`hi-IN`, `ar-EG`, `ru-RU`…) tout en
  respectant le fuseau horaire du visiteur.
- **Contenus éditoriaux** : les articles, rapports et webinaires n'existent qu'en
  FR/EN (`pick()` renvoie l'anglais pour les 6 autres langues) ; il en va de même
  des pages historiques `/a-propos`, `/mentions-legales`, `/politiques`,
  `/outils`, `/ressources`, `/guides`, `/recap` et des fiches partenaires.
- **Emails** : gabarits FR/EN ; `localeOf()` renvoie le français pour `fr*` et
  l'anglais pour tout le reste (y compris `de`, `hi`, `ar`…) afin d'éviter
  d'envoyer du français à un visiteur hispanophone.
- **Tests** (`node scripts/test-i18n.mjs [url]`) : vérifient pour les 8 langues le
  code `lang`, le `dir` (RTL pour l'arabe) et la présence des textes traduits sur
  `/`, `/analyses` et `/rapports`, plus le repli anglais des pages historiques.

### 5.7 Responsive et adaptation à tous les écrans

- Grilles systématiquement mobiles d'abord (`grid-cols-1` → `sm:grid-cols-2` →
  `lg:grid-cols-3|4`) via `CardGrid` ; aucun élément à largeur fixe en pixels.
- Tableaux (admin, horaires des marchés) dans des conteneurs `overflow-x-auto`.
- Barre de navigation mobile dédiée (grille 3 colonnes + accès connexion /
  inscription visible sous `md`), sélecteur de langue et mode sombre compacts.
- Typographies et espacements progressifs (`text-lg sm:text-xl md:text-2xl`,
  `py-12 md:py-16`), titres en `break-words` et `overflow-wrap` global pour
  éviter les débordements horizontaux.
- Widgets TradingView / CoinMarketCap : hauteurs réduites sur mobile
  (`h-[400px] md:h-[640px]`) et zones de défilement adaptées.
- `export const viewport` (layout) : largeur d'appareil, zoom autorisé (jusqu'à
  5×) et `themeColor` clair/sombre pour la barre des navigateurs mobiles.
- `scripts/test-css.mjs` vérifie que la feuille de styles contient bien les
  breakpoints, les utilitaires logiques et les règles RTL réellement utilisés.

### 5.8 Améliorations optionnelles (backlog)

- **File d'attente email** (BullMQ + Redis) si > 3 000 abonnés.
- **Recherche full-text PostgreSQL** (`tsvector` + index GIN) à partir de ~500 contenus.
- **Planification des envois** (`scheduledAt` déjà présent dans `Campaign`).
- **OAuth Google** (l'adaptateur Prisma et les tables `Account`/`Session` sont déjà prêts).
- **Stockage objet** (Supabase Storage/S3) si le volume de PDF dépasse quelques Go.
- **Tests automatisés** (Playwright sur les parcours inscription → téléchargement).

## 6. Exploitation : tâches planifiées

| Tâche | Endpoint | Fréquence conseillée |
|---|---|---|
| Newsletter hebdomadaire | `POST /api/cron/newsletter` (en-tête `x-cron-secret`) | lundi 08:00 |
| Rappels de webinaires | `POST /api/cron/rappels-webinaires` | toutes les heures |

Sur Coolify : *Scheduled Tasks* → `curl -fsS -X POST https://tradingeducationpro.com/api/cron/newsletter -H "x-cron-secret: $CRON_SECRET"`.

## 7. Routes et API (récapitulatif)

### Pages publiques (Server Components, indexables)

| Route | Contenu |
|---|---|
| `/analyses`, `/analyses/[slug]` | Liste + analyse longue (JSON-LD `Article`, commentaires, contenus associés) |
| `/rapports`, `/rapports/[slug]` | Liste + détail rapport (JSON-LD `Report`, bouton de téléchargement) |
| `/webinaires`, `/webinaires/[slug]` | Liste (à venir + replays) + détail (JSON-LD `Event`, inscription) |
| `/inscription`, `/connexion`, `/mot-de-passe-oublie`, `/reinitialiser-mot-de-passe` | Parcours compte |
| `/newsletter/confirmation`, `/newsletter/desinscription` | Retours de double opt-in |
| `/confidentialite` | Politique de confidentialité (RGPD) |
| `/sitemap.xml`, `/robots.txt` | Générés dynamiquement (`app/sitemap.ts`, `app/robots.ts`) |

### Espace membre (protégé par `middleware.ts`)

| Route | Rôle |
|---|---|
| `/espace-membre` | Tableau de bord : prochains webinaires, historique de téléchargements, préférences |
| `/espace-membre/preferences` | Opt-in/opt-out email, export JSON, suppression du compte |

### Administration (`/admin`, réservé au rôle `ADMIN`)

`/admin` (statistiques) · `/admin/articles` + `/admin/articles/[id]` ·
`/admin/rapports` + `/admin/rapports/[id]` · `/admin/webinaires` + `/admin/webinaires/[id]` ·
`/admin/abonnes` (recherche + export CSV) · `/admin/commentaires` (modération) ·
`/admin/emails` (campagnes + journal). La création utilise l'identifiant `nouveau`
(ex. `/admin/articles/nouveau`).

### API

| Méthode & route | Description |
|---|---|
| `POST /api/inscription` | Création de compte (bcrypt), emails bienvenue + confirmation newsletter |
| `POST /api/mot-de-passe-oublie` · `POST /api/reinitialiser-mot-de-passe` | Réinitialisation (token 1 h, table `VerificationToken`) |
| `GET/POST /api/auth/[...nextauth]` · `GET /api/auth/session` | NextAuth (JWT, adaptateur Prisma) |
| `POST/GET/DELETE /api/newsletter` | Abonnement (double opt-in), confirmation, désinscription |
| `GET/POST /api/rapports/[slug]/telecharger` | Téléchargement comptabilisé / email d'alerte optionnel |
| `POST /api/webinaires/[slug]/inscription` | Inscription au webinaire + email de confirmation |
| `GET/POST /api/articles/[slug]/commentaires` | Lecture publique / écriture membres (modération) |
| `PUT /api/membre/preferences` · `GET/DELETE /api/membre/donnees` | Préférences + export RGPD + suppression |
| `POST /api/analytics` | Beacon de mesure d'audience (respecte le consentement) |
| `GET /api/fichiers/[...key]` | Images stockées localement (cache immuable) |
| `POST /api/admin/upload` | Upload PDF/images (validation type + taille) |
| `GET/POST /api/admin/articles` · `PATCH/DELETE /api/admin/articles/[id]` | CRUD analyses |
| `GET/POST /api/admin/rapports` · `PATCH/DELETE /api/admin/rapports/[id]` | CRUD rapports (publication = email aux abonnés) |
| `GET/POST /api/admin/webinaires` · `PATCH/DELETE /api/admin/webinaires/[id]` | CRUD webinaires |
| `GET /api/admin/abonnes` (`?format=csv`, `?q=`, `?page=`) | Inscrits + export CSV |
| `GET/POST /api/admin/emails` | Campagnes (`mode: "campaign"` ou `"test"`) + journal |
| `GET/PATCH /api/admin/commentaires` | Modération |
| `POST /api/cron/newsletter` · `POST /api/cron/rappels-webinaires` | Tâches planifiées (`x-cron-secret`) |

## 8. Composants UI créés

| Composant | Usage |
|---|---|
| `NewsletterForm` | Formulaire d'abonnement (consentement RGPD explicite) |
| `DownloadReportButton` | Téléchargement + capture d'email optionnelle |
| `WebinarRegisterForm` | Inscription webinaire (membre connecté ou email seul) |
| `CommentSection` | Liste + publication de commentaires |
| `auth/LoginForm`, `auth/RegisterForm`, `auth/PasswordForms`, `auth/LogoutButton` | Parcours compte |
| `member/MemberPreferencesForm` | Préférences email + zone RGPD (export/suppression) |
| `CookieConsent`, `AnalyticsTracker` | Consentement + mesure d'audience |
| `admin/AdminShell`, `admin/fields`, `admin/UploadField` | Habillage et champs d'admin |
| `admin/ArticleForm`, `admin/ReportForm`, `admin/WebinarForm` | CRUD contenus |
| `admin/CampaignForm`, `admin/ModerationList` | Emails groupés et modération |

## 9. Procédure de mise en service

```bash
# 1. Dépendances et génération du client Prisma
npm install

# 2. Variables d'environnement
cp .env.example .env      # renseigner DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY…

# 3. Schéma + données initiales (admin, catégories, contenus de démo)
npm run db:deploy         # ou `npm run db:migrate` en développement
npm run db:seed
npm run db:import-guides  # importe les 10 guides historiques dans la base

# 4. Développement / production
npm run dev               # http://localhost:3000
npm run build && npm start
```

En production (Coolify) :

1. Créer une base PostgreSQL (service Coolify ou Supabase) et renseigner `DATABASE_URL`.
2. Ajouter un **volume persistant** sur `/app/storage` (PDF et images).
3. Renseigner les variables : `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `RESEND_API_KEY`,
   `EMAIL_FROM`, `IP_SALT`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`.
4. Exécuter une fois `npm run db:deploy` puis `npm run db:seed` (console Coolify).
5. Créer les *Scheduled Tasks* (voir §6).

## 10. Conformité et sécurité

- Aucune donnée bancaire : aucun formulaire de paiement, aucun prestataire de paiement.
- Mots de passe hachés (bcrypt), jamais journalisés ; sessions JWT signées (30 jours).
- Consentement explicite pour la newsletter (**double opt-in**) et pour la mesure d'audience.
- Adresses IP **hachées avec sel** (`IP_SALT`) dans les statistiques, jamais stockées en clair.
- Limitation de débit sur inscription, connexion, commentaires, webinaires, analytics.
- En-têtes de sécurité (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) dans `next.config.js`.
- Droits RGPD opérationnels : export JSON et suppression de compte en 1 clic.
- Contenus HTML saisis par l'administrateur uniquement (aucun HTML utilisateur rendu).

## 11. Points d'attention connus

- **Limitation de débit en mémoire** (`lib/rate-limit.ts`) : suffisante pour une instance ;
  passer à Redis (Upstash) si plusieurs instances.
- **Envois d'emails séquentiels** : adapté jusqu'à ~2 000 destinataires par envoi
  (`CAMPAIGN_MAX_RECIPIENTS`) ; au-delà, file d'attente dédiée.
- **Champ « tags » en texte libre** dans l'admin : les mots-clés sont normalisés
  automatiquement en slugs (pas de doublon).
- **Contenu HTML** des analyses/webinaires : saisi par l'admin, affiché tel quel
  (`dangerouslySetInnerHTML`). Ne jamais y injecter de contenu utilisateur.
