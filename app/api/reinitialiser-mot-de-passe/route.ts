import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation";

/** Finalise la réinitialisation du mot de passe à partir du token email. */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`reset:${ip ?? "anonyme"}`, 10, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez plus tard." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token: parsed.data.token },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json(
      { error: "Lien invalide ou expiré. Merci de refaire une demande." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.update({
    where: { email: record.identifier },
    data: { passwordHash, emailVerified: new Date() },
  });

  await prisma.verificationToken.deleteMany({ where: { identifier: record.identifier } });

  return NextResponse.json({ ok: true });
}
