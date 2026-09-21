/**
 * Import des guides historiques (app/guides/*.tsx) dans la table Article.
 *
 * - Source de vérité du contenu : app/guides/[id]/page.tsx (versions EN et FR)
 *   + app/guides/page.tsx (descriptions de repli côté liste).
 * - Idempotent : upsert par slug (= identifiant de guide existant, ex. "rsi").
 * - Les pages /guides/<id> restent la version canonique ; les articles importés
 *   sont rattachés à la catégorie "guides-education" afin que /analyses/<slug>
 *   redirige vers /guides/<slug> (pas de contenu dupliqué).
 *
 * Usage : npm run db:import-guides
 */
import fs from "node:fs";
import path from "node:path";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const ROOT = process.cwd();
const DETAIL_FILE = path.join(ROOT, "app", "guides", "[id]", "page.tsx");
const LIST_FILE = path.join(ROOT, "app", "guides", "page.tsx");
const EXTENDED_FR_FILE = path.join(ROOT, "app", "guides", "guides-fr-extended.ts");

const CATEGORY_SLUG = "guides-education";

const TAGS_BY_GUIDE = {
  rsi: ["indicateurs", "technique"],
  "money-management": ["gestion-du-risque", "capital"],
  leverage: ["levier", "marge"],
  ichimoku: ["indicateurs", "technique"],
  "economic-calendar": ["macro", "fondamental"],
  "risk-reward": ["gestion-du-risque"],
  psychology: ["psychologie"],
  backtesting: ["backtesting", "methodologie"],
  "dca-vs-swing": ["strategie", "gestion-du-risque"],
  timeframes: ["technique", "methodologie"],
};

/** Extrait `id`, `title`, `description` et `content` du tableau EN. */
function extractEnglishGuides(source) {
  const start = source.indexOf("const guides = [");
  const end = source.indexOf("const guidesFr");
  if (start === -1 || end === -1) {
    throw new Error("Impossible de localiser le tableau `guides` dans app/guides/[id]/page.tsx");
  }

  const block = source.slice(start, end);
  const pattern =
    /id:\s*"([^"]+)"[\s\S]*?title:\s*(?:"([^"]*)"|'([^']*)')[\s\S]*?description:\s*(?:"([^"]*)"|'([^']*)')[\s\S]*?content:\s*`([\s\S]*?)`/g;

  const entries = [];
  let match;
  while ((match = pattern.exec(block)) !== null) {
    entries.push({
      id: match[1],
      title: match[2] ?? match[3] ?? match[1],
      description: match[4] ?? match[5] ?? "",
      content: match[6] ?? "",
    });
  }
  return entries;
}

/** Extrait les variantes françaises (`guidesFr`) indexées par identifiant. */
function extractFrenchGuides(source) {
  const start = source.indexOf("const guidesFr");
  if (start === -1) return {};

  const block = source.slice(start);
  // Les clés FR sont tantôt nues (`rsi: {`), tantôt entre guillemets (`"money-management": {`).
  const pattern =
    /"?([a-z0-9-]+)"?\s*:\s*\{\s*title:\s*(?:"([^"]*)"|'([^']*)')\s*,\s*description:\s*(?:"([^"]*)"|'([^']*)')\s*,\s*content:\s*`([\s\S]*?)`/g;

  const entries = {};
  let match;
  while ((match = pattern.exec(block)) !== null) {
    entries[match[1]] = {
      title: match[2] ?? match[3] ?? "",
      description: match[4] ?? match[5] ?? "",
      content: match[6] ?? "",
    };
  }
  return entries;
}

/** Descriptions de repli depuis la page liste (si absentes du détail). */
function extractListDescriptions(source) {
  const pattern = /id:\s*"([^"]+)"[\s\S]*?description:\s*(?:"((?:[^"\\]|\\.)*)"|'([^']*)')/g;
  const map = {};
  let match;
  while ((match = pattern.exec(source)) !== null) {
    map[match[1]] = (match[2] ?? match[3] ?? "").replace(/\\"/g, '"');
  }
  return map;
}

/**
 * Contenus FR enrichis (parité avec l'anglais) définis dans
 * app/guides/guides-fr-extended.ts : ils ont la priorité sur `guidesFr`.
 */
function extractExtendedFrenchGuides(source) {
  const start = source.indexOf("guidesFrExtended");
  if (start === -1) return {};

  const block = source.slice(start);
  const pattern =
    /"?([a-z0-9-]+)"?\s*:\s*\{\s*title:\s*(?:"([^"]*)"|'([^']*)')\s*,\s*description:\s*(?:"([^"]*)"|'([^']*)')\s*,\s*content:\s*`([\s\S]*?)`/g;

  const entries = {};
  let match;
  while ((match = pattern.exec(block)) !== null) {
    entries[match[1]] = {
      title: match[2] ?? match[3] ?? "",
      description: match[4] ?? match[5] ?? "",
      content: match[6] ?? "",
    };
  }
  return entries;
}

const words = (html) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const readingMinutes = (html) => Math.max(3, Math.round(words(html) / 220));

async function main() {
  const detailSource = fs.readFileSync(DETAIL_FILE, "utf8");
  const listDescriptions = extractListDescriptions(fs.readFileSync(LIST_FILE, "utf8"));

  const englishGuides = extractEnglishGuides(detailSource);
  const frenchGuides = extractFrenchGuides(detailSource);
  // Les contenus FR enrichis ont la priorité (parité avec l'anglais).
  const extendedFrench =
    fs.existsSync(EXTENDED_FR_FILE) === false
      ? {}
      : extractExtendedFrenchGuides(fs.readFileSync(EXTENDED_FR_FILE, "utf8"));

  if (englishGuides.length === 0) {
    throw new Error("Aucun guide détecté : vérifiez la structure de app/guides/[id]/page.tsx");
  }

  const category = await prisma.category.upsert({
    where: { slug: CATEGORY_SLUG },
    update: {
      name: "Guides & education",
      nameFr: "Guides & éducation",
      description: "Guides pédagogiques (RSI, money management, psychologie…)",
      kind: "ARTICLE",
    },
    create: {
      slug: CATEGORY_SLUG,
      name: "Guides & education",
      nameFr: "Guides & éducation",
      description: "Guides pédagogiques (RSI, money management, psychologie…)",
      kind: "ARTICLE",
      sortOrder: 1,
    },
  });

  let created = 0;
  let updated = 0;
  const missingFrench = [];
  let extendedCount = 0;

  for (const guide of englishGuides) {
    const french = { ...frenchGuides[guide.id], ...extendedFrench[guide.id] };
    if (extendedFrench[guide.id]?.content) extendedCount += 1;
    if (!french?.content) missingFrench.push(guide.id);

    const base = {
      title: guide.title,
      titleFr: french?.title ?? null,
      excerpt: guide.description || `${guide.title} — guide pédagogique Trading Education.`,
      excerptFr: french?.description ?? listDescriptions[guide.id] ?? null,
      contentHtml: guide.content,
      contentHtmlFr: french?.content ?? null,
      seoTitle: french?.title ?? guide.title,
      seoDescription: french?.description ?? listDescriptions[guide.id] ?? guide.description,
      status: "PUBLISHED",
      readingMinutes: readingMinutes(guide.content),
      categoryId: category.id,
    };

    const tagSlugs = TAGS_BY_GUIDE[guide.id] ?? ["education"];
    const tags = {
      connectOrCreate: tagSlugs.map((slug) => ({
        where: { slug },
        create: { slug, name: slug.replace(/-/g, " ") },
      })),
    };

    const existing = await prisma.article.findUnique({
      where: { slug: guide.id },
      select: { id: true, publishedAt: true },
    });

    if (existing) {
      await prisma.article.update({
        where: { slug: guide.id },
        data: {
          ...base,
          publishedAt: existing.publishedAt ?? new Date(),
          tags: { set: [], ...tags },
        },
      });
      updated += 1;
    } else {
      await prisma.article.create({
        data: { ...base, slug: guide.id, publishedAt: new Date(), tags },
      });
      created += 1;
    }
  }

  console.log(
    `Guides importes : ${created} crees, ${updated} mis a jour (total ${englishGuides.length}).`
  );
  console.log(`Slugs : ${englishGuides.map((guide) => guide.id).join(", ")}`);
  console.log(`Contenus FR enrichis utilises : ${extendedCount}`);
  if (missingFrench.length > 0) {
    console.log(`Sans version FR complete : ${missingFrench.join(", ")}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
