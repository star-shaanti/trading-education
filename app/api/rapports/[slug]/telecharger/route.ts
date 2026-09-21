import { NextResponse } from "next/server";
import { hashIp, trackEvent } from "@/lib/analytics";
import { getCurrentUser } from "@/lib/auth";
import { SITE_URL, getLang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { clientIp, userAgentOf } from "@/lib/rate-limit";
import { contentTypeFor, isLocalFile, keyFromFileUrl, readStoredFile } from "@/lib/storage";
import { downloadReportSchema } from "@/lib/validation";
import { upsertSubscriber } from "@/lib/subscribers";
import { sendEmail } from "@/lib/email";
import { confirmUrlFor, newsletterConfirmEmail } from "@/lib/email-templates";

/**
 * Téléchargement d'un rapport (gratuit, tout public).
 * GET  : journalise le téléchargement puis sert le PDF (ou redirige vers l'URL).
 * POST : enregistre l'email optionnel (opt-in newsletter) et renvoie l'URL.
 */
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const report = await prisma.report
    .findFirst({ where: { slug: params.slug, status: "PUBLISHED" } })
    .catch(() => null);

  if (!report) {
    return NextResponse.json({ error: "Rapport introuvable." }, { status: 404 });
  }

  const user = await getCurrentUser();
  const ip = clientIp(request);

  await prisma.reportDownload.create({
    data: {
      reportId: report.id,
      userId: user?.id ?? null,
      email: user?.email ?? null,
      source: "site",
      ipHash: hashIp(ip),
      userAgent: userAgentOf(request)?.slice(0, 300) ?? null,
    },
  });

  await prisma.report.update({
    where: { id: report.id },
    data: { downloadCount: { increment: 1 } },
  });

  await trackEvent({
    type: "REPORT_DOWNLOAD",
    entityType: "report",
    entitySlug: report.slug,
    path: `/rapports/${report.slug}`,
    userId: user?.id ?? null,
    ip,
    userAgent: userAgentOf(request),
  });

  if (isLocalFile(report.fileUrl)) {
    try {
      const key = keyFromFileUrl(report.fileUrl);
      const file = await readStoredFile(key);
      const filename = report.fileName ?? `${report.slug}.pdf`;
      return new Response(new Uint8Array(file), {
        headers: {
          "Content-Type": contentTypeFor(key),
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      });
    } catch {
      return NextResponse.json({ error: "Fichier indisponible." }, { status: 404 });
    }
  }

  return NextResponse.redirect(report.fileUrl);
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const report = await prisma.report
    .findFirst({ where: { slug: params.slug, status: "PUBLISHED" } })
    .catch(() => null);

  if (!report) {
    return NextResponse.json({ error: "Rapport introuvable." }, { status: 404 });
  }

  const payload = await request.json().catch(() => ({}));
  const parsed = downloadReportSchema.safeParse(payload);

  if (parsed.success && parsed.data.email && parsed.data.subscribe) {
    const locale = getLang();
    const { subscriber } = await upsertSubscriber({
      email: parsed.data.email,
      source: "rapport",
      locale,
      reportsOptIn: true,
    });

    if (!subscriber.confirmedAt && subscriber.confirmToken) {
      const template = newsletterConfirmEmail({
        confirmUrl: confirmUrlFor(subscriber.confirmToken),
        name: subscriber.name,
        locale,
      });
      await sendEmail({
        to: subscriber.email,
        subject: template.subject,
        html: template.html,
        type: "NEWSLETTER_CONFIRM",
        userId: subscriber.userId,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    url: `/api/rapports/${report.slug}/telecharger`,
    siteUrl: `${SITE_URL}/rapports/${report.slug}`,
  });
}
