import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/auth";
import { saveWebinar } from "@/lib/admin-content";
import { prisma } from "@/lib/prisma";
import { webinarInputSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = webinarInputSchema.safeParse({ ...payload, id: params.id });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  try {
    const webinar = await saveWebinar(parsed.data);
    return NextResponse.json({ ok: true, webinar });
  } catch (error) {
    console.error("[admin/webinaires] mise à jour impossible", error);
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  try {
    await prisma.webinar.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Webinaire introuvable." }, { status: 404 });
  }
}
