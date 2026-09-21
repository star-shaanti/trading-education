import type { EmailStatus, EmailType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Envoi d'emails via l'API HTTP Resend (palier gratuit : 3 000 emails/mois).
 * En développement, sans RESEND_API_KEY, les emails sont journalisés
 * (statut SKIPPED) : rien n'est envoyé mais toute la logique reste testable.
 * Aucun SDK supplémentaire n'est requis (simple `fetch`).
 */

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  type: EmailType;
  userId?: string | null;
  campaignId?: string | null;
  replyTo?: string | null;
  /** Lien de désinscription (ajouté en en-tête List-Unsubscribe). */
  unsubscribeUrl?: string | null;
};

export type SendEmailResult = {
  ok: boolean;
  status: EmailStatus;
  id?: string;
  error?: string;
};

export function emailProvider(): "resend" | "noop" {
  return process.env.RESEND_API_KEY ? "resend" : "noop";
}

async function logEmail(
  input: SendEmailInput,
  status: EmailStatus,
  provider: string,
  providerId?: string | null,
  error?: string | null
) {
  try {
    await prisma.emailLog.create({
      data: {
        type: input.type,
        to: input.to,
        subject: input.subject,
        status,
        provider,
        providerId: providerId ?? null,
        error: error ?? null,
        userId: input.userId ?? null,
        campaignId: input.campaignId ?? null,
      },
    });
  } catch (logError) {
    console.error("[email] journalisation impossible", logError);
  }
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Trading Education <contact@tradingeducationpro.com>";
  const replyTo = input.replyTo ?? process.env.EMAIL_REPLY_TO ?? undefined;

  if (!apiKey) {
    console.info(`[email:noop] ${input.type} → ${input.to} — ${input.subject}`);
    await logEmail(input, "SKIPPED", "noop");
    return { ok: true, status: "SKIPPED" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(input.unsubscribeUrl
          ? { headers: { "List-Unsubscribe": `<${input.unsubscribeUrl}>` } }
          : {}),
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };

    if (!response.ok) {
      throw new Error(payload?.message ?? `Erreur Resend (${response.status})`);
    }

    await logEmail(input, "SENT", "resend", payload?.id ?? null);
    return { ok: true, status: "SENT", id: payload?.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    await logEmail(input, "FAILED", "resend", null, message);
    console.error(`[email] échec de l'envoi à ${input.to}`, message);
    return { ok: false, status: "FAILED", error: message };
  }
}

/** Pause utilitaire pour respecter les limites de débit du fournisseur. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
