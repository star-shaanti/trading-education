import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/auth";
import { saveReport } from "@/lib/admin-content";
import { prisma } from "@/lib/prisma";
import { reportInputSchema } from "@/lib/validation";

/** Liste (admin) des rapports. */
export async function GET() {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { category: true },
  });

  return NextResponse.json({ reports });
}

/** Création d'un rapport. Si publié, les abonnés sont notifiés par email. */
export async function POST(request: Request) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = reportInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  try {
    const report = await saveReport({ ...parsed.data, id: undefined });
    return NextResponse.json({ ok: true, report }, { status: 201 });
  } catch (error) {
    console.error("[admin/rapports] création impossible", error);
    return NextResponse.json({ error: "Création impossible." }, { status: 500 });
  }
}
