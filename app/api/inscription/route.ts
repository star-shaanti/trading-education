import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { sendEmail } from "@/lib/email";
import { confirmUrlFor, newsletterConfirmEmail, welcomeEmail } from "@/lib/email-templates";
import { clientIp, rateLimit, userAgentOf } from "@/lib/rate-limit";
import { SITE_URL, getLang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { upsertSubscriber } from "@/lib/subscribers";
import { registerSchema } from "@/lib/validation";

/** Inscription gratuite (visiteur → membre). Aucun paiement. */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`inscription:${ip ?? "anonyme"}`, 5, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Trop de tentatives, réessayez dans ${limit.retryAfter}s.` },
      { status: 429 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { email, password, name, newsletterOptIn } = parsed.data;
  // Langue du formulaire (cookie te_lang) : sert au compte et aux emails.
  const locale = getLang();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez votre mot de passe." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name: name?.trim() || null,
      passwordHash,
      role: "MEMBER",
      locale,
      consentAt: new Date(),
      newsletterOptIn,
    },
  });

  const { subscriber } = await upsertSubscriber({
    email,
    name: user.name,
    source: "inscription",
    locale,
    userId: user.id,
    newsletterOptIn,
  });

  const unsubscribeUrl = `${SITE_URL}/api/newsletter?action=unsubscribe&token=${subscriber.unsubscribeToken}`;

  const welcome = welcomeEmail({ name: user.name, locale, unsubscribeUrl });
  await sendEmail({
    to: email,
    subject: welcome.subject,
    html: welcome.html,
    type: "WELCOME",
    userId: user.id,
    unsubscribeUrl,
  });

  // Double opt-in obligatoire avant tout envoi de newsletter.
  if (!subscriber.confirmedAt && subscriber.confirmToken) {
    const confirm = newsletterConfirmEmail({
      confirmUrl: confirmUrlFor(subscriber.confirmToken),
      name: user.name,
      locale,
    });
    await sendEmail({
      to: email,
      subject: confirm.subject,
      html: confirm.html,
      type: "NEWSLETTER_CONFIRM",
      userId: user.id,
    });
  }

  await trackEvent({
    type: "SIGNUP",
    userId: user.id,
    subscriberId: subscriber.id,
    ip,
    userAgent: userAgentOf(request),
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
