import type { EmailType } from "@prisma/client";
import { SITE_URL, withLocale } from "@/lib/i18n";

/**
 * Gabarits HTML des emails transactionnels et de la newsletter.
 * Bilingues FR/EN : la langue est déduite de la locale du destinataire
 * (membre, abonné ou participant à un webinaire) — voir `localeOf`.
 * HTML inline (compatibilité clients mail) + charte Trading Education.
 */

export type EmailLocale = "fr" | "en";

/**
 * Convertit n'importe quelle locale stockée ("en", "en-GB", "fr-FR", "de"…) en
 * langue d'email disponible. Les gabarits n'existent qu'en FR/EN : les autres
 * langues d'interface (es, de, it, hi, ar, ru) reçoivent l'anglais.
 */
export function localeOf(value?: string | null): EmailLocale {
  if (typeof value === "string" && value.toLowerCase().slice(0, 2) === "fr") return "fr";
  return "en";
}

const BRAND = {
  primary: "#4F46E5",
  dark: "#0B132B",
  text: "#1E293B",
  muted: "#64748B",
  bg: "#F1F5F9",
};

export type Template = { subject: string; html: string; type: EmailType };

const STRINGS = {
  fr: {
    hello: (name?: string | null) => (name ? `Bonjour ${name},` : "Bonjour,"),
    unsubscribe: "Se désinscrire de ces emails",
    legal:
      "Trading Education — contenu éducatif uniquement. Aucun conseil en investissement, aucune donnée bancaire collectée.",
    ignore: "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.",
  },
  en: {
    hello: (name?: string | null) => (name ? `Hi ${name},` : "Hello,"),
    unsubscribe: "Unsubscribe from these emails",
    legal:
      "Trading Education — educational content only. No investment advice, no banking data collected.",
    ignore: "If you did not request this, you can safely ignore this email.",
  },
} as const;

export function emailLayout(options: {
  lang?: string | null;
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerExtra?: string;
  unsubscribeUrl?: string;
}): string {
  const lang = options.lang ? localeOf(options.lang) : "fr";
  const t = STRINGS[lang];
  const { title, bodyHtml, ctaLabel, ctaUrl, footerExtra, unsubscribeUrl } = options;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:Helvetica,Arial,sans-serif;color:${BRAND.text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:${BRAND.dark};padding:20px 24px;">
              <span style="color:#ffffff;font-size:18px;font-weight:bold;">Trading Education</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;">
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${BRAND.dark};">${title}</h1>
              <div style="font-size:15px;line-height:1.6;color:${BRAND.text};">${bodyHtml}</div>
              ${
                ctaLabel && ctaUrl
                  ? `<p style="margin:28px 0 8px;"><a href="${ctaUrl}" style="background:${BRAND.primary};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:bold;display:inline-block;">${ctaLabel}</a></p>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px;background:${BRAND.bg};font-size:12px;line-height:1.6;color:${BRAND.muted};">
              ${footerExtra ?? ""}
              <p style="margin:8px 0 0;">
                Trading Education — <a href="${SITE_URL}" style="color:${BRAND.primary};">tradingeducationpro.com</a><br />
                ${t.legal}
              </p>
              ${
                unsubscribeUrl
                  ? `<p style="margin:8px 0 0;"><a href="${unsubscribeUrl}" style="color:${BRAND.muted};">${t.unsubscribe}</a></p>`
                  : ""
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ------------------------------- Compte ------------------------------------

export function welcomeEmail(options: {
  name?: string | null;
  locale?: string | null;
  unsubscribeUrl?: string;
}): Template {
  const lang = options.locale ? localeOf(options.locale) : "fr";
  const t = STRINGS[lang];

  const copy =
    lang === "fr"
      ? {
          subject: "Bienvenue sur Trading Education — votre compte est actif",
          title: "Bienvenue sur Trading Education",
          body: `<p>${t.hello(options.name)}</p>
        <p>Votre compte gratuit est activé. Il vous permet de :</p>
        <ul>
          <li>télécharger les rapports hebdomadaires et recevoir les alertes,</li>
          <li>vous inscrire aux webinaires (replays inclus),</li>
          <li>commenter les analyses,</li>
          <li>gérer vos préférences d'email à tout moment.</li>
        </ul>
        <p>Aucune donnée bancaire n'est demandée : tout le contenu est gratuit.</p>`,
          cta: "Découvrir les analyses",
        }
      : {
          subject: "Welcome to Trading Education — your account is active",
          title: "Welcome to Trading Education",
          body: `<p>${t.hello(options.name)}</p>
        <p>Your free account is now active. It lets you:</p>
        <ul>
          <li>download the weekly reports and get notified about new ones,</li>
          <li>register for webinars (replays included),</li>
          <li>comment on articles,</li>
          <li>update your email preferences at any time.</li>
        </ul>
        <p>No banking data is required — all content is free.</p>`,
          cta: "Browse the analysis",
        };

  return {
    type: "WELCOME",
    subject: copy.subject,
    html: emailLayout({
      lang,
      title: copy.title,
      bodyHtml: copy.body,
      ctaLabel: copy.cta,
      ctaUrl: `${SITE_URL}${withLocale("/analyses", lang)}`,
      unsubscribeUrl: options.unsubscribeUrl,
    }),
  };
}

export function newsletterConfirmEmail(options: {
  confirmUrl: string;
  name?: string | null;
  locale?: string | null;
}): Template {
  const lang = options.locale ? localeOf(options.locale) : "fr";
  const t = STRINGS[lang];

  const copy =
    lang === "fr"
      ? {
          subject: "Confirmez votre inscription à la newsletter (1 clic)",
          title: "Confirmez votre inscription",
          body: `<p>${t.hello(options.name)}</p>
        <p>Merci de confirmer votre inscription pour recevoir chaque semaine les nouveaux rapports, analyses et webinaires.</p>
        <p>Vous ne recevrez aucun email tant que ce lien n'aura pas été utilisé.</p>`,
          cta: "Confirmer mon inscription",
        }
      : {
          subject: "Confirm your newsletter subscription (one click)",
          title: "Confirm your subscription",
          body: `<p>${t.hello(options.name)}</p>
        <p>Please confirm your subscription to receive the new reports, analysis and webinars every week.</p>
        <p>You will not receive any email until you use this link.</p>`,
          cta: "Confirm my subscription",
        };

  return {
    type: "NEWSLETTER_CONFIRM",
    subject: copy.subject,
    html: emailLayout({
      lang,
      title: copy.title,
      bodyHtml: copy.body,
      ctaLabel: copy.cta,
      ctaUrl: options.confirmUrl,
      footerExtra: `<p>${t.ignore}</p>`,
    }),
  };
}

export function passwordResetEmail(options: { resetUrl: string; locale?: string | null }): Template {
  const lang = options.locale ? localeOf(options.locale) : "fr";

  const copy =
    lang === "fr"
      ? {
          subject: "Réinitialisation de votre mot de passe",
          title: "Réinitialiser votre mot de passe",
          body: `<p>Vous avez demandé à réinitialiser votre mot de passe Trading Education.</p>
        <p>Ce lien est valable 1 heure. Si vous n'êtes pas à l'origine de cette demande, aucune action n'est nécessaire.</p>`,
          cta: "Choisir un nouveau mot de passe",
        }
      : {
          subject: "Reset your password",
          title: "Reset your password",
          body: `<p>You requested a password reset for your Trading Education account.</p>
        <p>This link is valid for 1 hour. If you did not request it, no action is required.</p>`,
          cta: "Choose a new password",
        };

  return {
    type: "PASSWORD_RESET",
    subject: copy.subject,
    html: emailLayout({
      lang,
      title: copy.title,
      bodyHtml: copy.body,
      ctaLabel: copy.cta,
      ctaUrl: options.resetUrl,
    }),
  };
}

export function unsubscribeUrlFor(token: string): string {
  return `${SITE_URL}/api/newsletter?action=unsubscribe&token=${token}`;
}

export function confirmUrlFor(token: string): string {
  return `${SITE_URL}/api/newsletter?action=confirm&token=${token}`;
}

// ------------------------------ Webinaires ---------------------------------

export function webinarConfirmationEmail(options: {
  webinarTitle: string;
  webinarUrl: string;
  startsAtLabel: string;
  timezone: string;
  joinUrl?: string | null;
  locale?: string | null;
  unsubscribeUrl?: string;
}): Template {
  const lang = options.locale ? localeOf(options.locale) : "fr";

  const copy =
    lang === "fr"
      ? {
          subject: `Inscription confirmée : ${options.webinarTitle}`,
          title: "Votre place est réservée",
          body: `<p>Votre inscription au webinaire suivant est confirmée :</p>
        <p><strong>${options.webinarTitle}</strong><br />${options.startsAtLabel} (${options.timezone})</p>
        <p>Un rappel automatique vous sera envoyé 24 h avant la session.</p>`,
          cta: options.joinUrl ? "Accéder à la session" : "Voir la page du webinaire",
        }
      : {
          subject: `Registration confirmed: ${options.webinarTitle}`,
          title: "Your seat is booked",
          body: `<p>Your registration for the following webinar is confirmed:</p>
        <p><strong>${options.webinarTitle}</strong><br />${options.startsAtLabel} (${options.timezone})</p>
        <p>An automatic reminder will be sent 24 hours before the session.</p>`,
          cta: options.joinUrl ? "Join the session" : "Open the webinar page",
        };

  return {
    type: "WEBINAR_CONFIRM",
    subject: copy.subject,
    html: emailLayout({
      lang,
      title: copy.title,
      bodyHtml: copy.body,
      ctaLabel: copy.cta,
      ctaUrl: options.joinUrl || options.webinarUrl,
      unsubscribeUrl: options.unsubscribeUrl,
    }),
  };
}

export function webinarReminderEmail(options: {
  webinarTitle: string;
  webinarUrl: string;
  startsAtLabel: string;
  timezone: string;
  joinUrl?: string | null;
  locale?: string | null;
  unsubscribeUrl?: string;
}): Template {
  const lang = options.locale ? localeOf(options.locale) : "fr";

  const copy =
    lang === "fr"
      ? {
          subject: `Rappel : ${options.webinarTitle} — ${options.startsAtLabel}`,
          title: "Votre webinaire commence bientôt",
          body: `<p>Petit rappel : le webinaire <strong>${options.webinarTitle}</strong> démarre le ${options.startsAtLabel} (${options.timezone}).</p>
        <p>Prévoyez quelques minutes d'avance pour rejoindre la session.</p>`,
          cta: "Rejoindre le webinaire",
        }
      : {
          subject: `Reminder: ${options.webinarTitle} — ${options.startsAtLabel}`,
          title: "Your webinar starts soon",
          body: `<p>Quick reminder: the webinar <strong>${options.webinarTitle}</strong> starts on ${options.startsAtLabel} (${options.timezone}).</p>
        <p>Please join a few minutes early.</p>`,
          cta: "Join the webinar",
        };

  return {
    type: "WEBINAR_REMINDER",
    subject: copy.subject,
    html: emailLayout({
      lang,
      title: copy.title,
      bodyHtml: copy.body,
      ctaLabel: copy.cta,
      ctaUrl: options.joinUrl || options.webinarUrl,
      unsubscribeUrl: options.unsubscribeUrl,
    }),
  };
}

// -------------------------- Rapports & newsletter ---------------------------

export function newReportEmail(options: {
  reportTitle: string;
  reportUrl: string;
  summary: string;
  periodLabel?: string | null;
  locale?: string | null;
  unsubscribeUrl?: string;
}): Template {
  const lang = options.locale ? localeOf(options.locale) : "fr";
  const period = options.periodLabel ? ` — ${options.periodLabel}` : "";

  const copy =
    lang === "fr"
      ? {
          subject: `Nouveau rapport disponible : ${options.reportTitle}`,
          title: "Nouveau rapport hebdomadaire",
          body: `<p><strong>${options.reportTitle}</strong>${period}</p>
        <p>${options.summary}</p>
        <p>Le PDF est en accès libre, sans inscription obligatoire.</p>`,
          cta: "Télécharger le rapport (PDF)",
        }
      : {
          subject: `New report available: ${options.reportTitle}`,
          title: "New weekly report",
          body: `<p><strong>${options.reportTitle}</strong>${period}</p>
        <p>${options.summary}</p>
        <p>The PDF is free to download, no subscription required.</p>`,
          cta: "Download the report (PDF)",
        };

  return {
    type: "NEW_REPORT",
    subject: copy.subject,
    html: emailLayout({
      lang,
      title: copy.title,
      bodyHtml: copy.body,
      ctaLabel: copy.cta,
      ctaUrl: options.reportUrl,
      unsubscribeUrl: options.unsubscribeUrl,
    }),
  };
}

export type DigestItem = { title: string; url: string; kind: string };

export function weeklyDigestEmail(options: {
  items: DigestItem[];
  unsubscribeUrl: string;
  webinars?: DigestItem[];
  locale?: string | null;
}): Template {
  const lang = options.locale ? localeOf(options.locale) : "fr";

  const list = (items: DigestItem[]) =>
    items
      .map(
        (item) =>
          `<li style="margin-bottom:8px;"><a href="${item.url}" style="color:${BRAND.primary};">${item.title}</a> <span style="color:${BRAND.muted};font-size:12px;">(${item.kind})</span></li>`
      )
      .join("");

  const webinarsHtml = options.webinars?.length
    ? `<h2 style="font-size:16px;margin:24px 0 8px;color:${BRAND.dark};">${
        lang === "fr" ? "Prochains webinaires" : "Upcoming webinars"
      }</h2><ul style="padding-left:18px;margin:0;">${list(options.webinars)}</ul>`
    : "";

  const copy =
    lang === "fr"
      ? {
          subject: "Trading Education — la synthèse de la semaine",
          title: "La synthèse de la semaine",
          intro: "<p>Voici les contenus publiés ces 7 derniers jours :</p>",
          cta: "Voir toutes les analyses",
        }
      : {
          subject: "Trading Education — your weekly roundup",
          title: "Your weekly roundup",
          intro: "<p>Here is what we published over the last 7 days:</p>",
          cta: "See all the analysis",
        };

  return {
    type: "WEEKLY_DIGEST",
    subject: copy.subject,
    html: emailLayout({
      lang,
      title: copy.title,
      bodyHtml: `${copy.intro}
        <ul style="padding-left:18px;margin:0;">${list(options.items)}</ul>
        ${webinarsHtml}`,
      ctaLabel: copy.cta,
      ctaUrl: `${SITE_URL}${withLocale("/analyses", lang)}`,
      unsubscribeUrl: options.unsubscribeUrl,
    }),
  };
}

export function bulkEmail(options: {
  subject: string;
  bodyHtml: string;
  unsubscribeUrl?: string;
  title?: string;
  locale?: string | null;
}): Template {
  return {
    type: "BULK_CAMPAIGN",
    subject: options.subject,
    html: emailLayout({
      lang: options.locale ? localeOf(options.locale) : "fr",
      title: options.title ?? options.subject,
      bodyHtml: options.bodyHtml,
      unsubscribeUrl: options.unsubscribeUrl,
    }),
  };
}
