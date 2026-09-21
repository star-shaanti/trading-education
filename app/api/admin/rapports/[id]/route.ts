import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/auth";
import { saveReport } from "@/lib/admin-content";
import { prisma } from "@/lib/prisma";
import { reportInputSchema } from "@/lib/validation";

/** Mise à jour d'un rapport (publication = notification des abonnés). */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = reportInputSchema.safeParse({ ...payload, id: params.id });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  try {
    const report = await saveReport(parsed.data);
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    console.error("[admin/rapports] mise à jour impossible", error);
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  try {
    await prisma.report.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Rapport introuvable." }, { status: 404 });
  }
}
