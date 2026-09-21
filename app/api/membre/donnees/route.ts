import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * RGPD — droits d'accès et d'effacement :
 * GET    : export JSON de toutes les données personnelles du membre ;
 * DELETE : suppression définitive du compte (et des commentaires associés).
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const [profile, downloads, registrations, comments, preferences, subscriber] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        locale: true,
        createdAt: true,
        lastLoginAt: true,
        consentAt: true,
      },
    }),
    prisma.reportDownload.findMany({
      where: { userId: user.id },
      select: { createdAt: true, report: { select: { slug: true, title: true } } },
    }),
    prisma.webinarRegistration.findMany({
      where: { userId: user.id },
      select: { createdAt: true, status: true, webinar: { select: { slug: true, title: true } } },
    }),
    prisma.comment.findMany({
      where: { userId: user.id },
      select: { createdAt: true, status: true, body: true },
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { newsletterOptIn: true, reportsOptIn: true, webinarsOptIn: true },
    }),
    prisma.subscriber.findUnique({
      where: { email: user.email },
      select: {
        createdAt: true,
        confirmedAt: true,
        unsubscribedAt: true,
        newsletterOptIn: true,
        reportsOptIn: true,
        webinarsOptIn: true,
      },
    }),
  ]);

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    profile,
    emailPreferences: preferences,
    newsletterSubscription: subscriber,
    reportDownloads: downloads,
    webinarRegistrations: registrations,
    comments,
  };

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="mes-donnees-trading-education.json"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }
  if (user.role === "ADMIN") {
    return NextResponse.json(
      { error: "Un compte administrateur ne peut pas être supprimé depuis cette page." },
      { status: 403 }
    );
  }

  await prisma.$transaction([
    // Les commentaires sont supprimés en cascade avec le compte (voir schema).
    prisma.subscriber.updateMany({
      where: { email: user.email },
      data: { userId: null, newsletterOptIn: false, reportsOptIn: false, unsubscribedAt: new Date() },
    }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);

  return NextResponse.json({ ok: true });
}
