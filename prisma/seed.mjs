/**
 * Seed initial — crée l'administrateur, les catégories, tags et 3 contenus
 * de démonstration (article, rapport PDF, webinaire).
 * Usage : npm run db:seed
 */
import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@tradingeducationpro.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMoi123!";
const EDITOR_EMAIL = (process.env.EDITOR_EMAIL || "redacteur@tradingeducationpro.com").toLowerCase();
const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD || "Redacteur123!";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN", passwordHash },
    create: {
      email: ADMIN_EMAIL,
      name: "Administrateur",
      role: "ADMIN",
      passwordHash,
      emailVerified: new Date(),
      consentAt: new Date(),
    },
  });

  // Rédacteur : accès limité aux contenus (analyses, rapports, webinaires)
  // et à la modération des commentaires — pas d'accès aux inscrits ni aux emails.
  const editorPasswordHash = await bcrypt.hash(EDITOR_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: EDITOR_EMAIL },
    update: { role: "EDITOR", passwordHash: editorPasswordHash },
    create: {
      email: EDITOR_EMAIL,
      name: "Rédacteur",
      role: "EDITOR",
      passwordHash: editorPasswordHash,
      emailVerified: new Date(),
      consentAt: new Date(),
    },
  });

  const categories = [
    { slug: "analyses-macro", name: "Macro Analysis", nameFr: "Analyse macro", kind: "ARTICLE" },
    { slug: "banques-centrales", name: "Central Banks", nameFr: "Banques centrales", kind: "ARTICLE" },
    { slug: "rapports-hebdo", name: "Weekly Reports", nameFr: "Rapports hebdomadaires", kind: "REPORT" },
    { slug: "webinaires-education", name: "Educational Webinars", nameFr: "Webinaires éducatifs", kind: "WEBINAR" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const tags = ["banques-centrales", "inflation", "taux-directeurs", "forex", "crypto"];
  for (const slug of tags) {
    await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { slug, name: slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) },
    });
  }

  const article = await prisma.article.upsert({
    where: { slug: "fed-taux-2026-perspectives" },
    update: {},
    create: {
      slug: "fed-taux-2026-perspectives",
      title: "Fed policy 2026 outlook",
      titleFr: "Perspectives 2026 sur la politique de la Fed",
      excerpt: "What the dot plot and bond markets imply for the next 12 months.",
      excerptFr: "Ce que le dot plot et le marché obligataire impliquent pour les 12 prochains mois.",
      contentHtml:
        "<h2>Points clés</h2><p>Le marché intègre deux baisses de taux sur douze mois. Nous analysons les scénarios de croissance et d'inflation.</p><h3>Données suivies</h3><ul><li>CPI core</li><li>NFP</li><li>Discours des membres du FOMC</li></ul>",
      contentHtmlFr:
        "<h2>Points clés</h2><p>Le marché intègre deux baisses de taux sur douze mois. Nous analysons les scénarios de croissance et d'inflation.</p><h3>Données suivies</h3><ul><li>CPI core</li><li>NFP</li><li>Discours des membres du FOMC</li></ul>",
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date(),
      readingMinutes: 8,
      authorId: admin.id,
      categoryId: (await prisma.category.findUnique({ where: { slug: "banques-centrales" } }))?.id,
      tags: { connect: [{ slug: "banques-centrales" }, { slug: "inflation" }] },
    },
  });

  await prisma.report.upsert({
    where: { slug: "rapport-hebdomadaire-demo" },
    update: {},
    create: {
      slug: "rapport-hebdomadaire-demo",
      title: "Weekly market report — demo",
      titleFr: "Rapport hebdomadaire — démo",
      summary: "Weekly recap of macro data, central banks and cross-asset positioning.",
      summaryFr: "Récapitulatif hebdomadaire : macro, banques centrales et positionnement cross-asset.",
      fileUrl: "https://example.com/rapport-demo.pdf",
      fileName: "rapport-demo.pdf",
      periodLabel: "Semaine 38 — 2026",
      fileSizeBytes: 102400,
      status: "PUBLISHED",
      publishedAt: new Date(),
      categoryId: (await prisma.category.findUnique({ where: { slug: "rapports-hebdo" } }))?.id,
      tags: { connect: [{ slug: "inflation" }] },
    },
  });

  const nextWeek = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  await prisma.webinar.upsert({
    where: { slug: "webinaire-lecture-marche-demo" },
    update: {},
    create: {
      slug: "webinaire-lecture-marche-demo",
      title: "Live market reading — demo session",
      titleFr: "Lecture de marché en direct — session démo",
      description: "Live session: reading the economic calendar and building a weekly bias.",
      descriptionFr: "Session live : lecture du calendrier économique et construction d'un biais hebdomadaire.",
      platform: "zoom",
      startsAt: nextWeek,
      endsAt: new Date(nextWeek.getTime() + 3600 * 1000),
      joinUrl: "https://zoom.us/j/0000000000",
      status: "SCHEDULED",
      publishedAt: new Date(),
      capacity: 500,
      categoryId: (await prisma.category.findUnique({ where: { slug: "webinaires-education" } }))?.id,
      tags: { connect: [{ slug: "forex" }] },
    },
  });

  console.log("Seed terminé.");
  console.log(`Admin   : ${ADMIN_EMAIL} (mot de passe : ${ADMIN_PASSWORD})`);
  console.log(`Rédacteur : ${EDITOR_EMAIL} (mot de passe : ${EDITOR_PASSWORD})`);
  console.log(`Article de démo : /analyses/${article.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
