import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sendCampaign } from "@/lib/campaigns";
import { sendEmail } from "@/lib/email";
import { bulkEmail } from "@/lib/email-templates";
import { getLang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { campaignInputSchema, testEmailSchema } from "@/lib/validation";

/**
 * Envoi d'emails groupés (admin).
 * - mode "test"     : envoi à une seule adresse (vérification du gabarit) ;
 * - mode "campaign" : campagne complète vers une audience.
 * Les envois sont séquentiels (voir lib/campaigns.ts) et journalisés dans EmailLog.
 */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const [campaigns, logs] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
  ]);

  return NextResponse.json({ campaigns, logs });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const mode = (payload as { mode?: string } | null)?.mode ?? "campaign";

  if (mode === "test") {
    const parsed = testEmailSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données de test invalides." }, { status: 400 });
    }

    const template = bulkEmail({
      subject: parsed.data.subject,
      bodyHtml: parsed.data.bodyHtml,
      locale: getLang(),
    });

    const result = await sendEmail({
      to: parsed.data.testEmail,
      subject: `[TEST] ${template.subject}`,
      html: template.html,
      type: "ADMIN_TEST",
      userId: admin.id,
    });

    return NextResponse.json({ ok: result.ok, status: result.status, error: result.error });
  }

  const parsed = campaignInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  const result = await sendCampaign({
    subject: parsed.data.subject,
    bodyHtml: parsed.data.bodyHtml,
    audience: parsed.data.audience,
    createdById: admin.id,
  });

  return NextResponse.json({ ok: true, ...result });
}
