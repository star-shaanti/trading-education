import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { webinarConfirmationEmail, localeOf } from "@/lib/email-templates";
import { SITE_URL, formatDateTime, getLang, pick } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { webinarRegistrationSchema } from "@/lib/validation";

/** Inscription gratuite à un webinaire (compte connecté ou email seul). */
export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const ip = clientIp(request);
  const limit = rateLimit(`webinar:${ip ?? "anonyme"}`, 10, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez plus tard." }, { status: 429 });
  }

  const webinar = await prisma.webinar
    .findFirst({
      where: { slug: params.slug, publishedAt: { not: null } },
      include: { _count: { select: { registrations: true } } },
    })
    .catch(() => null);

  if (!webinar) {
    return NextResponse.json({ error: "Webinaire introuvable." }, { status: 404 });
  }

  const user = await getCurrentUser();
  const payload = await request.json().catch(() => ({}));
  const parsed = webinarRegistrationSchema.safeParse(payload);
  // Langue : celle du compte connecté, sinon celle du navigateur (cookie te_lang).
  const locale = localeOf(user?.locale ?? getLang());

  if (!parsed.success && !user) {
    return NextResponse.json({ error: "Email requis." }, { status: 400 });
  }

  const finalEmail = user?.email ?? (parsed.success ? parsed.data.email : undefined);
  const name = user?.name ?? (parsed.success ? parsed.data.name : undefined);

  if (!finalEmail) {
    return NextResponse.json({ error: "Email requis." }, { status: 400 });
  }

  if (webinar.capacity && webinar._count.registrations >= webinar.capacity) {
    return NextResponse.json({ error: "Webinaire complet." }, { status: 409 });
  }

  const existing = await prisma.webinarRegistration.findUnique({
    where: { webinarId_email: { webinarId: webinar.id, email: finalEmail } },
  });

  if (existing && existing.status === "REGISTERED") {
    return NextResponse.json({ ok: true, alreadyRegistered: true });
  }

  const registration = await prisma.webinarRegistration.upsert({
    where: { webinarId_email: { webinarId: webinar.id, email: finalEmail } },
    update: {
      status: "REGISTERED",
      name: name ?? undefined,
      userId: user?.id ?? undefined,
      locale,
    },
    create: {
      webinarId: webinar.id,
      email: finalEmail,
      name: name ?? null,
      userId: user?.id ?? null,
      locale,
    },
  });

  const template = webinarConfirmationEmail({
    webinarTitle: pick(locale, webinar.title, webinar.titleFr) ?? webinar.title,
    webinarUrl: `${SITE_URL}/webinaires/${webinar.slug}`,
    startsAtLabel: formatDateTime(webinar.startsAt, locale, webinar.timezone),
    timezone: webinar.timezone,
    joinUrl: webinar.joinUrl,
    locale,
  });

  await sendEmail({
    to: finalEmail,
    subject: template.subject,
    html: template.html,
    type: "WEBINAR_CONFIRM",
    userId: user?.id ?? null,
  });

  await prisma.webinarRegistration.update({
    where: { id: registration.id },
    data: { confirmationSentAt: new Date() },
  });

  await trackEvent({
    type: "WEBINAR_REGISTER",
    entityType: "webinar",
    entitySlug: webinar.slug,
    path: `/webinaires/${webinar.slug}`,
    userId: user?.id ?? null,
    ip,
  });

  return NextResponse.json({ ok: true, email: finalEmail, joinUrl: webinar.joinUrl });
}
