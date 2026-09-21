# Schéma de base de données (PostgreSQL / Prisma)

Source de vérité : [`prisma/schema.prisma`](../prisma/schema.prisma).

## Vue d'ensemble

```
User ──1:N── Article (auteur)          Category ──1:N── Article / Report / Webinar
User ──1:N── Comment                   Tag ──M:N── Article / Report / Webinar
User ──1:N── ReportDownload            Report ──1:N── ReportDownload
User ──1:N── WebinarRegistration       Webinar ──1:N── WebinarRegistration
User ──1:N── EmailLog / Campaign       Subscriber ──0..1── User
User ──1:N── AnalyticsEvent
```

## Tables et rôles fonctionnels

| Table | Rôle fonctionnel |
|---|---|
| `User` | Compte (visiteur abonné, membre, administrateur). Email unique, mot de passe haché, préférences email, consentement |
| `Account`, `Session`, `VerificationToken` | Requis par l'adaptateur NextAuth. `VerificationToken` sert aussi aux liens de réinitialisation de mot de passe |
| `Subscriber` | Abonné email (peut exister **sans compte**) : double opt-in (`confirmToken`/`confirmedAt`), token de désinscription, source |
| `Category` | Catégorie typée par `ContentKind` (ARTICLE / REPORT / WEBINAR) |
| `Tag` | Mots-clés transverses (analyse, rapport, webinaire) |
| `Article` | Analyse longue : version EN + FR, HTML, SEO, `viewCount`, statut, auteur, catégorie |
| `Report` | Rapport PDF : `fileUrl` (`storage:<cle>` ou URL absolue), période, compteurs vues/téléchargements |
| `ReportDownload` | Journal des téléchargements (email, IP hachée, source) → historique membre + statistiques |
| `Webinar` | Session live/replay : plateforme, dates, `joinUrl`, `replayUrl`, capacité, statut |
| `WebinarRegistration` | Inscription au webinaire (email unique par webinaire), suivi des emails de confirmation/rappel, `locale` du participant |
| `Comment` | Commentaire d'analyse avec statut de modération (PENDING par défaut) |
| `EmailLog` | Journal de **chaque** email transactionnel ou de campagne (statut, erreur, identifiant fournisseur) |
| `Campaign` | Envoi groupé depuis l'admin (audience, compteurs envoyés/échecs) |
| `AnalyticsEvent` | Mesure d'audience interne : type, chemin, contenu, session anonyme, IP hachée |

## Enums

| Enum | Valeurs | Utilisation |
|---|---|---|
| `UserRole` | `VISITOR`, `MEMBER`, `EDITOR`, `ADMIN` | Contrôle d'accès (middleware + API) : `EDITOR` = contenus et modération uniquement |
| `ContentStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` | Cycle de vie des contenus (seuls `PUBLISHED` sont visibles/indexés) |
| `ContentKind` | `ARTICLE`, `REPORT`, `WEBINAR` | Typage des catégories |
| `WebinarStatus` | `SCHEDULED`, `LIVE`, `ENDED`, `CANCELED` | Affichage inscription vs replay |
| `RegistrationStatus` | `REGISTERED`, `CANCELED`, `ATTENDED` | Suivi des participants |
| `CommentStatus` | `PENDING`, `APPROVED`, `REJECTED` | Modération |
| `EmailType` | `WELCOME`, `VERIFY_EMAIL`, `PASSWORD_RESET`, `NEWSLETTER_CONFIRM`, `WEBINAR_CONFIRM`, `WEBINAR_REMINDER`, `NEW_REPORT`, `WEEKLY_DIGEST`, `BULK_CAMPAIGN`, `ADMIN_TEST` | Traçabilité par nature d'email |
| `EmailStatus` | `QUEUED`, `SENT`, `FAILED`, `SKIPPED` | `SKIPPED` = mode développement (pas de clé Resend) |
| `AnalyticsType` | `PAGE_VIEW`, `ARTICLE_VIEW`, `REPORT_VIEW`, `REPORT_DOWNLOAD`, `WEBINAR_VIEW`, `WEBINAR_REGISTER`, `SIGNUP`, `LOGIN`, `COMMENT`, `NEWSLETTER_SUBSCRIBE` | Entonnoir de conversion |

## Choix de conception

- **Un abonné ≠ un compte** : la newsletter est ouverte aux visiteurs ; la table
  `Subscriber` est la source unique des envois, avec rattachement optionnel à un `User`.
- **Double opt-in obligatoire** : `Subscriber.confirmedAt` doit être renseigné pour
  figurer dans les audiences (`lib/subscribers.ts`).
- **Compteurs dénormalisés** (`viewCount`, `downloadCount`) pour des listes rapides,
  alimentés par la route de téléchargement et le beacon analytics.
- **Aucune donnée bancaire** : aucune table de paiement, d'abonnement ou de facture.
- **RGPD by design** : seules les IP **hachées** sont conservées (`AnalyticsEvent.ipHash`,
  `Comment.ipHash`, `ReportDownload.ipHash`) ; suppression de compte en cascade sur les
  commentaires (`onDelete: Cascade`) et `SetNull` sur l'historique.
- **Contenus bilingues** : colonnes `*` (EN) et `*Fr` (FR) avec repli automatique
  (`pick()` dans `lib/i18n.ts`).

## Index principaux

| Table | Index | Raison |
|---|---|---|
| `Article`, `Report` | `(status, publishedAt)` | Listes publiques triées par date |
| `Webinar` | `(status, startsAt)` | Prochains webinaires / rappels |
| `Comment` | `(articleId, status, createdAt)`, `(status)` | Affichage public + file de modération |
| `AnalyticsEvent` | `(type, createdAt)`, `(entityType, entitySlug)`, `(sessionId)` | Statistiques 30 jours et contenus les plus vus |
| `Subscriber` | `(newsletterOptIn, unsubscribedAt)`, `(confirmedAt)` | Résolution rapide des audiences |
| `WebinarRegistration` | `@@unique([webinarId, email])` | Idempotence de l'inscription |

## Migrations

```bash
# Développement : crée la migration + l'applique + génère le client
npm run db:migrate -- --name init

# Production (Coolify, image Docker) : applique les migrations en attente
npm run db:deploy

# Prototypage rapide (sans historique de migration)
npm run db:push

# Exploration visuelle des données
npm run db:studio
```

> Le client Prisma est généré automatiquement (`postinstall` → `prisma generate`).
> Dans le Dockerfile, `npm run db:generate` est exécuté avant `next build`, et
> `node_modules/.prisma` est copié dans l'image finale (voir `Dockerfile`).

## Jeu de données initial (`prisma/seed.mjs`)

```bash
npm run db:seed
```

Crée, de façon idempotente :

1. l'administrateur (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) ;
2. 4 catégories (analyse macro, banques centrales, rapports hebdo, webinaires) ;
3. 5 mots-clés (banques centrales, inflation, taux directeurs, forex, crypto) ;
4. 1 analyse publiée, 1 rapport PDF de démonstration, 1 webinaire programmé (J+7).

Les PDF réels sont ensuite déposés depuis l'admin (**Rapports → Nouveau rapport →
Fichier PDF**), ce qui renseigne `fileUrl` avec `storage:rapports/<fichier>`.

## Sauvegardes

- **Base** : `pg_dump` quotidien (Coolify → *Backups* ou tâche planifiée) :
  `pg_dump "$DATABASE_URL" | gzip > backup-$(date +%F).sql.gz`.
- **Fichiers** : sauvegarder le volume `/app/storage` (PDF et images).
- **Restauration** : `gunzip -c backup.sql.gz | psql "$DATABASE_URL"` puis remonter le volume.
