import crypto from "node:crypto";
import type { AnalyticsType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Analytics interne (respectueux de la vie privée) :
 * - aucune adresse IP en clair ; seul un hachage salé est stocké (RGPD) ;
 * - les vues sont journalisées côté serveur pour les pages publiques,
 *   et via /api/analytics pour la navigation client.
 */

export type TrackInput = {
  type: AnalyticsType;
  path?: string | null;
  entityType?: string | null;
  entitySlug?: string | null;
  userId?: string | null;
  subscriberId?: string | null;
  sessionId?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
};

export function hashIp(ip?: string | null): string | null {
  if (!ip) return null;
  return crypto
    .createHash("sha256")
    .update(`${ip}|${process.env.IP_SALT ?? "trading-education"}`)
    .digest("hex")
    .slice(0, 40);
}

export async function trackEvent(input: TrackInput): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type: input.type,
        path: input.path ?? null,
        entityType: input.entityType ?? null,
        entitySlug: input.entitySlug ?? null,
        userId: input.userId ?? null,
        subscriberId: input.subscriberId ?? null,
        sessionId: input.sessionId ?? null,
        referrer: input.referrer ?? null,
        userAgent: input.userAgent?.slice(0, 300) ?? null,
        ipHash: hashIp(input.ip),
      },
    });
  } catch (error) {
    // Les analytics ne doivent jamais casser une requête utilisateur.
    console.error("[analytics] journalisation impossible", error);
  }
}

/** Incrémente le compteur de vues dénormalisé d'un contenu. */
export async function incrementViewCount(
  entityType: "article" | "report" | "webinar",
  id: string
): Promise<void> {
  try {
    if (entityType === "article") {
      await prisma.article.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    } else if (entityType === "report") {
      await prisma.report.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    } else {
      await prisma.webinar.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    }
  } catch (error) {
    console.error("[analytics] compteur de vues non incrémenté", error);
  }
}
