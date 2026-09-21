import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/auth";
import { saveArticle } from "@/lib/admin-content";
import { prisma } from "@/lib/prisma";
import { articleInputSchema } from "@/lib/validation";

/** Liste (admin) des articles. */
export async function GET() {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { category: true, _count: { select: { comments: true } } },
  });

  return NextResponse.json({ articles });
}

/** Création d'un article. */
export async function POST(request: Request) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = articleInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  try {
    const article = await saveArticle({ ...parsed.data, id: undefined });
    return NextResponse.json({ ok: true, article }, { status: 201 });
  } catch (error) {
    console.error("[admin/articles] création impossible", error);
    return NextResponse.json({ error: "Création impossible." }, { status: 500 });
  }
}
