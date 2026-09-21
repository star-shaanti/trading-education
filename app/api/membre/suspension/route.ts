import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Suspension de compte (réversible, RGPD-friendly) :
 * - `POST`   : met le compte en pause — communications coupées, **données
 *   conservées** (commentaires, téléchargements, webinaires) ;
 * - `DELETE` : réactive immédiatement le compte.
 *
 * La reconnexion réactive automatiquement un compte suspendu (voir `lib/auth.ts`),
 * ce qui évite tout blocage définitif sans passer par un email.
 */
export async function POST(request: Request) {
  const limit = rateLimit(`suspension:${clientIp(request) ?? "anonyme"}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Merci de patienter une minute." },
      { status: 429 }
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }
  if (user.role === "ADMIN") {
    return NextResponse.json(
      { error: "Un compte administrateur ne peut pas être suspendu depuis cette page." },
      { status: 403 }
    );
  }

  const suspendedAt = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        suspendedAt,
        // Les envois d'emails sont interrompus pendant la pause.
        newsletterOptIn: false,
        reportsOptIn: false,
        webinarsOptIn: false,
      },
    }),
    prisma.subscriber.updateMany({
      where: { email: user.email },
      data: { newsletterOptIn: false, reportsOptIn: false, unsubscribedAt: suspendedAt },
    }),
  ]);

  return NextResponse.json({ ok: true, suspendedAt: suspendedAt.toISOString() });
}

/** Réactivation manuelle (la connexion le fait aussi automatiquement). */
export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { suspendedAt: null } });
  return NextResponse.json({ ok: true, suspendedAt: null });
}
