import { NextResponse } from "next/server";
import { incrementViewCount, trackEvent } from "@/lib/analytics";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit, userAgentOf } from "@/lib/rate-limit";
import { analyticsEventSchema } from "@/lib/validation";

/**
 * Journalisation des vues côté navigateur (pages publiques).
 * Répond toujours 204 : les analytics ne doivent jamais bloquer l'UX.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`analytics:${ip ?? "anonyme"}`, 90, 60_000);
  if (!limit.ok) return new NextResponse(null, { status: 204 });

  const payload = await request.json().catch(() => null);
  const parsed = analyticsEventSchema.safeParse(payload);
  if (!parsed.success) return new NextResponse(null, { status: 204 });

  const user = await getCurrentUser();
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionId = cookieHeader.match(/te_session=([^;]+)/)?.[1] ?? null;

  await trackEvent({
    type: parsed.data.type,
    path: parsed.data.path ?? null,
    entityType: parsed.data.entityType ?? null,
    entitySlug: parsed.data.entitySlug ?? null,
    referrer: parsed.data.referrer ?? null,
    userId: user?.id ?? null,
    sessionId,
    ip,
    userAgent: userAgentOf(request),
  });

  if (parsed.data.entityType && parsed.data.entitySlug && parsed.data.type !== "PAGE_VIEW") {
    try {
      if (parsed.data.entityType === "article") {
        const article = await prisma.article.findUnique({
          where: { slug: parsed.data.entitySlug },
          select: { id: true },
        });
        if (article) await incrementViewCount("article", article.id);
      } else if (parsed.data.entityType === "report") {
        const report = await prisma.report.findUnique({
          where: { slug: parsed.data.entitySlug },
          select: { id: true },
        });
        if (report) await incrementViewCount("report", report.id);
      } else {
        const webinar = await prisma.webinar.findUnique({
          where: { slug: parsed.data.entitySlug },
          select: { id: true },
        });
        if (webinar) await incrementViewCount("webinar", webinar.id);
      }
    } catch {
      // ignoré volontairement
    }
  }

  return new NextResponse(null, { status: 204 });
}
