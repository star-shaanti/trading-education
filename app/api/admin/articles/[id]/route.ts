import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/auth";
import { saveArticle } from "@/lib/admin-content";
import { prisma } from "@/lib/prisma";
import { articleInputSchema } from "@/lib/validation";

/** Mise à jour d'un article. */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = articleInputSchema.safeParse({ ...payload, id: params.id });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  try {
    const article = await saveArticle(parsed.data);
    return NextResponse.json({ ok: true, article });
  } catch (error) {
    console.error("[admin/articles] mise à jour impossible", error);
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
  }
}

/** Suppression d'un article (commentaires supprimés en cascade). */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  try {
    await prisma.article.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }
}
