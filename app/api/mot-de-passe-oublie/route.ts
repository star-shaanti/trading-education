import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail, localeOf } from "@/lib/email-templates";
import { SITE_URL } from "@/lib/i18n";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { newToken } from "@/lib/subscribers";
import { forgotPasswordSchema } from "@/lib/validation";

/** Demande de réinitialisation : réponse toujours neutre (anti-énumération). */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`forgot:${ip ?? "anonyme"}`, 5, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez plus tard." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const email = parsed.data.email;
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, passwordHash: true, locale: true } });

  if (user?.passwordHash) {
    const token = newToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

    const template = passwordResetEmail({
      resetUrl: `${SITE_URL}/reinitialiser-mot-de-passe?token=${token}`,
      locale: localeOf(user.locale),
    });

    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      type: "PASSWORD_RESET",
      userId: user.id,
    });
  }

  return NextResponse.json({ ok: true });
}
