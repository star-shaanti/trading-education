import { prisma } from "@/lib/prisma";
import { sendEmail, sleep } from "@/lib/email";
import {
  bulkEmail,
  localeOf,
  newReportEmail,
  webinarReminderEmail,
  weeklyDigestEmail,
  type DigestItem,
} from "@/lib/email-templates";
import { SITE_URL, formatDateTime, pick, withLocale } from "@/lib/i18n";
import {
  downloadersRecipients,
  memberRecipients,
  newsletterRecipients,
  reportRecipients,
} from "@/lib/subscribers";

/**
 * Envois de masse : alerte « nouveau rapport », newsletter hebdomadaire,
 * rappels de webinaires et campagnes manuelles depuis l'admin.
 * Les envois sont séquentiels et pausés pour respecter les limites du
 * fournisseur (Resend : ~2 requêtes/seconde). Au-delà de quelques milliers
 * d'abonnés, brancher une file d'attente (BullMQ + Redis).
 */

const PAUSE_MS = Number(process.env.EMAIL_PAUSE_MS ?? 400);
const MAX_RECIPIENTS = Number(process.env.CAMPAIGN_MAX_RECIPIENTS ?? 2000);

export type SendResult = { total: number; sent: number; failed: number };

/** Alerte « nouveau rapport disponible » (opt-in `reportsOptIn`). */
export async function notifyNewReport(report: {
  slug: string;
  title: string;
  titleFr: string | null;
  summary: string;
  summaryFr: string | null;
  periodLabel: string | null;
}): Promise<SendResult> {
  const recipients = (await reportRecipients()).slice(0, MAX_RECIPIENTS);
  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const isFr = recipient.locale !== "en";
    const unsubscribeUrl = `${SITE_URL}/api/newsletter?action=unsubscribe&token=${recipient.unsubscribeToken}`;

    const template = newReportEmail({
      reportTitle: (isFr ? report.titleFr : report.title) ?? report.title,
      reportUrl: `${SITE_URL}${withLocale(`/rapports/${report.slug}`, localeOf(recipient.locale))}`,
      summary: (isFr ? report.summaryFr : report.summary) ?? report.summary,
      periodLabel: report.periodLabel,
      locale: localeOf(recipient.locale),
      unsubscribeUrl,
    });

    const result = await sendEmail({
      to: recipient.email,
      subject: template.subject,
      html: template.html,
      type: "NEW_REPORT",
      userId: recipient.userId,
      unsubscribeUrl,
    });

    if (result.ok) sent += 1;
    else failed += 1;
    await sleep(PAUSE_MS);
  }

  return { total: recipients.length, sent, failed };
}

/** Newsletter hebdomadaire : synthèse des contenus publiés sur 7 jours. */
export async function sendWeeklyDigest(): Promise<SendResult> {
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);

  const [articles, reports, webinars] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED", publishedAt: { gte: since } },
      orderBy: { publishedAt: "desc" },
      take: 8,
      select: { slug: true, title: true, titleFr: true },
    }),
    prisma.report.findMany({
      where: { status: "PUBLISHED", publishedAt: { gte: since } },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: { slug: true, title: true, titleFr: true },
    }),
    prisma.webinar.findMany({
      where: { status: "SCHEDULED", startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 3,
      select: { slug: true, title: true, titleFr: true },
    }),
  ]);

  const items: DigestItem[] = [
    ...articles.map((article) => ({
      title: article.titleFr ?? article.title,
      url: `${SITE_URL}/analyses/${article.slug}`,
      kind: "analyse",
    })),
    ...reports.map((report) => ({
      title: report.titleFr ?? report.title,
      url: `${SITE_URL}/rapports/${report.slug}`,
      kind: "rapport PDF",
    })),
  ];

  const webinarItems: DigestItem[] = webinars.map((webinar) => ({
    title: webinar.titleFr ?? webinar.title,
    url: `${SITE_URL}/webinaires/${webinar.slug}`,
    kind: "webinaire",
  }));

  if (items.length === 0 && webinarItems.length === 0) {
    return { total: 0, sent: 0, failed: 0 };
  }

  const recipients = (await newsletterRecipients()).slice(0, MAX_RECIPIENTS);
  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const unsubscribeUrl = `${SITE_URL}/api/newsletter?action=unsubscribe&token=${recipient.unsubscribeToken}`;
    // Les liens pointent vers la version linguistique du destinataire (fr/en).
    const emailLocale = localeOf(recipient.locale);
    const localize = (url: string) =>
      `${SITE_URL}${withLocale(url.replace(SITE_URL, ""), emailLocale)}`;

    const template = weeklyDigestEmail({
      items: items.map((item) => ({ ...item, url: localize(item.url) })),
      webinars: webinarItems.map((item) => ({ ...item, url: localize(item.url) })),
      unsubscribeUrl,
      locale: emailLocale,
    });

    const result = await sendEmail({
      to: recipient.email,
      subject: template.subject,
      html: template.html,
      type: "WEEKLY_DIGEST",
      userId: recipient.userId,
      unsubscribeUrl,
    });

    if (result.ok) sent += 1;
    else failed += 1;
    await sleep(PAUSE_MS);
  }

  return { total: recipients.length, sent, failed };
}

/** Rappels automatiques 24 h avant chaque webinaire (cron quotidien). */
export async function sendWebinarReminders(): Promise<SendResult> {
  const now = new Date();
  const in26h = new Date(now.getTime() + 26 * 3600 * 1000);

  const webinars = await prisma.webinar.findMany({
    where: { status: "SCHEDULED", startsAt: { gte: now, lte: in26h } },
    include: {
      registrations: { where: { status: "REGISTERED", reminderSentAt: null } },
    },
  });

  let sent = 0;
  let failed = 0;
  let total = 0;

  for (const webinar of webinars) {
    for (const registration of webinar.registrations) {
      total += 1;
      const template = webinarReminderEmail({
        webinarTitle:
          pick(localeOf(registration.locale), webinar.title, webinar.titleFr) ?? webinar.title,
        webinarUrl: `${SITE_URL}${withLocale(
          `/webinaires/${webinar.slug}`,
          localeOf(registration.locale)
        )}`,
        startsAtLabel: formatDateTime(
          webinar.startsAt,
          localeOf(registration.locale),
          webinar.timezone
        ),
        timezone: webinar.timezone,
        joinUrl: webinar.joinUrl,
        locale: localeOf(registration.locale),
      });

      const result = await sendEmail({
        to: registration.email,
        subject: template.subject,
        html: template.html,
        type: "WEBINAR_REMINDER",
        userId: registration.userId,
      });

      if (result.ok) {
        sent += 1;
        await prisma.webinarRegistration.update({
          where: { id: registration.id },
          data: { reminderSentAt: new Date() },
        });
      } else {
        failed += 1;
      }
      await sleep(PAUSE_MS);
    }
  }

  return { total, sent, failed };
}

export type Recipient = {
  email: string;
  name?: string | null;
  userId?: string | null;
  unsubscribeUrl?: string;
  /** Locale ("fr" / "en" / "en-GB"…) pour la langue des emails. */
  locale?: string | null;
};

/** Résout une audience d'envoi : abonnés, membres, téléchargeurs, webinaire. */
export async function resolveAudience(audience: string): Promise<Recipient[]> {
  if (audience === "members") {
    const members = await memberRecipients();
    return members.map((member) => ({
      email: member.email,
      name: member.name,
      userId: member.id,
      locale: member.locale,
      unsubscribeUrl: `${SITE_URL}/espace-membre/preferences`,
    }));
  }

  if (audience === "downloaders") {
    return downloadersRecipients();
  }

  if (audience.startsWith("webinar:")) {
    const slug = audience.slice("webinar:".length);
    const registrations = await prisma.webinarRegistration.findMany({
      where: { webinar: { slug }, status: "REGISTERED" },
      select: { email: true, name: true, userId: true, locale: true },
    });
    return registrations.map((registration) => ({
      email: registration.email,
      name: registration.name,
      userId: registration.userId,
      locale: registration.locale,
    }));
  }

  const subscribers = await newsletterRecipients();
  return subscribers.map((subscriber) => ({
    email: subscriber.email,
    name: subscriber.name,
    userId: subscriber.userId,
    locale: subscriber.locale,
    unsubscribeUrl: `${SITE_URL}/api/newsletter?action=unsubscribe&token=${subscriber.unsubscribeToken}`,
  }));
}

/** Campagne manuelle (admin) : crée une trace puis envoie. */
export async function sendCampaign(options: {
  subject: string;
  bodyHtml: string;
  audience: string;
  createdById?: string | null;
}): Promise<SendResult & { campaignId: string }> {
  const recipients = (await resolveAudience(options.audience)).slice(0, MAX_RECIPIENTS);

  const campaign = await prisma.campaign.create({
    data: {
      subject: options.subject,
      bodyHtml: options.bodyHtml,
      audience: options.audience,
      recipientCount: recipients.length,
      createdById: options.createdById ?? null,
    },
  });

  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const template = bulkEmail({
      subject: options.subject,
      bodyHtml: options.bodyHtml,
      unsubscribeUrl: recipient.unsubscribeUrl,
      locale: localeOf(recipient.locale),
    });

    const result = await sendEmail({
      to: recipient.email,
      subject: template.subject,
      html: template.html,
      type: "BULK_CAMPAIGN",
      userId: recipient.userId,
      campaignId: campaign.id,
      unsubscribeUrl: recipient.unsubscribeUrl,
    });

    if (result.ok) sent += 1;
    else failed += 1;
    await sleep(PAUSE_MS);
  }

  await prisma.campaign.update({
    where: { id: campaign.id },
    data: { sentAt: new Date(), sentCount: sent, failedCount: failed },
  });

  return { campaignId: campaign.id, total: recipients.length, sent, failed };
}
