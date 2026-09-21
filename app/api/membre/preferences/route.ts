import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSubscriberPreferences } from "@/lib/subscribers";
import { memberPreferencesSchema } from "@/lib/validation";

/** Mise à jour des préférences email du membre (RGPD : droit de retrait). */
export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = memberPreferencesSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      newsletterOptIn: parsed.data.newsletterOptIn,
      reportsOptIn: parsed.data.reportsOptIn,
      webinarsOptIn: parsed.data.webinarsOptIn,
    },
  });

  await updateSubscriberPreferences(user.email, parsed.data);

  return NextResponse.json({ ok: true, preferences: parsed.data });
}
