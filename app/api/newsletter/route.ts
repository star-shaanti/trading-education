import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { sendEmail } from "@/lib/email";
import { confirmUrlFor, newsletterConfirmEmail } from "@/lib/email-templates";
import { SITE_URL, getLang } from "@/lib/i18n";
import { clientIp, rateLimit, userAgentOf } from "@/lib/rate-limit";
import {
  confirmSubscriberByToken,
  unsubscribeByEmail,
  unsubscribeByToken,
  upsertSubscriber,
} from "@/lib/subscribers";
import { subscriberSchema, unsubscribeSchema } from "@/lib/validation";

/**
 * Newsletter (double opt-in RGPD) :
 * - POST  : inscrit un email et envoie le lien de confirmation ;
 * - GET   : `?action=confirm&token=` / `?action=unsubscribe&token=`
 * - DELETE: désinscription par email (utilisée par la page de désinscription).
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`newsletter:${ip ?? "anonyme"}`, 10, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez plus tard." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = subscriberSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { subscriber } = await upsertSubscriber({
    email: parsed.data.email,
    name: parsed.data.name,
    source: parsed.data.source,
    locale: getLang(),
    newsletterOptIn: true,
  });

  // Un email de confirmation n'est envoyé que si l'abonné ne l'est pas déjà.
  if (!subscriber.confirmedAt && subscriber.confirmToken) {
    const template = newsletterConfirmEmail({
      confirmUrl: confirmUrlFor(subscriber.confirmToken),
      name: subscriber.name,
      locale: getLang(),
    });
    await sendEmail({
      to: subscriber.email,
      subject: template.subject,
      html: template.html,
      type: "NEWSLETTER_CONFIRM",
      userId: subscriber.userId,
    });
  }

  await trackEvent({
    type: "NEWSLETTER_SUBSCRIBE",
    subscriberId: subscriber.id,
    userId: subscriber.userId,
    path: "/newsletter",
    ip,
    userAgent: userAgentOf(request),
  });

  // Réponse identique dans tous les cas (confidentialité de l'existant).
  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const token = url.searchParams.get("token");

  if (action === "confirm" && token) {
    const subscriber = await confirmSubscriberByToken(token);
    return NextResponse.redirect(
      new URL(subscriber ? "/newsletter/confirmation?etat=ok" : "/newsletter/confirmation?etat=invalide", SITE_URL)
    );
  }

  if (action === "unsubscribe" && token) {
    const subscriber = await unsubscribeByToken(token);
    return NextResponse.redirect(
      new URL(subscriber ? "/newsletter/desinscription?etat=ok" : "/newsletter/desinscription?etat=invalide", SITE_URL)
    );
  }

  return NextResponse.redirect(new URL("/newsletter", SITE_URL));
}

export async function DELETE(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = unsubscribeSchema.safeParse(payload);
  if (!parsed.success || !parsed.data.email) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  await unsubscribeByEmail(parsed.data.email);
  return NextResponse.json({ ok: true });
}
