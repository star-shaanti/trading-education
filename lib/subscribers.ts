import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * Gestion des abonnés email (double opt-in RGPD).
 * Les abonnés sont distincts des comptes : un visiteur peut recevoir la
 * newsletter sans créer de compte, et un membre est rattaché à un abonné.
 */

export function newToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export type SubscriberInput = {
  email: string;
  name?: string | null;
  source?: string;
  locale?: string;
  userId?: string | null;
  newsletterOptIn?: boolean;
  reportsOptIn?: boolean;
};

/** Crée ou réactive un abonné (idempotent). */
export async function upsertSubscriber(input: SubscriberInput) {
  const email = input.email.toLowerCase().trim();
  const existing = await prisma.subscriber.findUnique({ where: { email } });

  if (existing) {
    const subscriber = await prisma.subscriber.update({
      where: { email },
      data: {
        name: input.name?.trim() || existing.name,
        userId: input.userId ?? existing.userId,
        unsubscribedAt: null,
        newsletterOptIn: input.newsletterOptIn ?? existing.newsletterOptIn,
        reportsOptIn: input.reportsOptIn ?? existing.reportsOptIn,
        // Réabonnement après désinscription : un nouveau double opt-in est exigé.
        confirmToken: existing.confirmedAt ? existing.confirmToken : newToken(),
        confirmedAt: existing.confirmedAt,
      },
    });
    return { subscriber, created: false };
  }

  const subscriber = await prisma.subscriber.create({
    data: {
      email,
      name: input.name?.trim() || null,
      source: input.source ?? "site",
      locale: input.locale ?? "fr",
      userId: input.userId ?? null,
      newsletterOptIn: input.newsletterOptIn ?? true,
      reportsOptIn: input.reportsOptIn ?? true,
      consentAt: new Date(),
      confirmToken: newToken(),
    },
  });
  return { subscriber, created: true };
}

export async function confirmSubscriberByToken(token: string) {
  const subscriber = await prisma.subscriber.findUnique({ where: { confirmToken: token } });
  if (!subscriber) return null;
  return prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { confirmedAt: subscriber.confirmedAt ?? new Date(), confirmToken: null },
  });
}

export async function unsubscribeByToken(token: string) {
  const subscriber = await prisma.subscriber.findUnique({ where: { unsubscribeToken: token } });
  if (!subscriber) return null;
  return prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { newsletterOptIn: false, reportsOptIn: false, webinarsOptIn: false, unsubscribedAt: new Date() },
  });
}

export async function unsubscribeByEmail(email: string) {
  const subscriber = await prisma.subscriber.findUnique({ where: { email: email.toLowerCase() } });
  if (!subscriber) return null;
  return prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { newsletterOptIn: false, reportsOptIn: false, webinarsOptIn: false, unsubscribedAt: new Date() },
  });
}

export async function updateSubscriberPreferences(
  email: string,
  prefs: { newsletterOptIn: boolean; reportsOptIn: boolean; webinarsOptIn: boolean }
) {
  const normalized = email.toLowerCase();
  const existing = await prisma.subscriber.findUnique({ where: { email: normalized } });
  if (!existing) return null;
  return prisma.subscriber.update({
    where: { id: existing.id },
    data: {
      ...prefs,
      unsubscribedAt: prefs.newsletterOptIn || prefs.reportsOptIn || prefs.webinarsOptIn ? null : new Date(),
    },
  });
}

/** Audiences d'envoi (RGPD : consentement confirmé, non désinscrit, opt-in actif). */
export async function newsletterRecipients() {
  return prisma.subscriber.findMany({
    where: { newsletterOptIn: true, confirmedAt: { not: null }, unsubscribedAt: null },
    select: { email: true, name: true, userId: true, locale: true, unsubscribeToken: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function reportRecipients() {
  return prisma.subscriber.findMany({
    where: { reportsOptIn: true, confirmedAt: { not: null }, unsubscribedAt: null },
    select: { email: true, name: true, userId: true, locale: true, unsubscribeToken: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function memberRecipients() {
  return prisma.user.findMany({
    where: { newsletterOptIn: true },
    select: { email: true, name: true, id: true, locale: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function downloadersRecipients() {
  const rows = await prisma.reportDownload.findMany({
    where: { email: { not: null } },
    distinct: ["email"],
    select: { email: true },
  });

  const emails = rows.map((row) => row.email).filter((email): email is string => Boolean(email));
  if (emails.length === 0) return [];

  // Locale récupérée auprès des abonnés pour envoyer dans la bonne langue.
  const subscribers = await prisma.subscriber.findMany({
    where: { email: { in: emails } },
    select: { email: true, locale: true },
  });
  const localeByEmail = new Map(subscribers.map((subscriber) => [subscriber.email, subscriber.locale]));

  return emails.map((email) => ({ email, locale: localeByEmail.get(email) ?? null }));
}
