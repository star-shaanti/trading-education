import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { moderationSchema } from "@/lib/validation";

/** Modération des commentaires (admin). */
export async function GET(request: Request) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const status = new URL(request.url).searchParams.get("status");
  const comments = await prisma.comment.findMany({
    where:
      status === "PENDING" || status === "APPROVED" || status === "REJECTED"
        ? { status }
        : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: { select: { email: true, name: true } },
      article: { select: { slug: true, title: true, titleFr: true } },
    },
  });

  return NextResponse.json({ comments });
}

export async function PATCH(request: Request) {
  const admin = await requireContentManager();
  if (!admin) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = moderationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.update({
      where: { id: parsed.data.commentId },
      data: {
        status: parsed.data.status,
        moderatedAt: new Date(),
        moderatedBy: admin.id,
      },
    });
    return NextResponse.json({ ok: true, comment });
  } catch {
    return NextResponse.json({ error: "Commentaire introuvable." }, { status: 404 });
  }
}
