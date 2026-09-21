import { NextResponse } from "next/server";
import { hashIp, trackEvent } from "@/lib/analytics";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { commentSchema } from "@/lib/validation";

/** Commentaires d'un article : lecture publique, écriture réservée aux membres. */
export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const article = await prisma.article
    .findUnique({ where: { slug: params.slug }, select: { id: true } })
    .catch(() => null);

  if (!article) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  const comments = await prisma.comment
    .findMany({
      where: { articleId: article.id, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        body: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    })
    .catch(() => []);

  return NextResponse.json({
    comments: comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      author: comment.user.name ?? "Membre",
    })),
  });
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise pour commenter." }, { status: 401 });
  }

  const ip = clientIp(request);
  const limit = rateLimit(`comment:${user.id}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Trop de commentaires, réessayez plus tard." }, { status: 429 });
  }

  const article = await prisma.article.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    select: { id: true },
  });
  if (!article) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = commentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Commentaire invalide." },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      articleId: article.id,
      userId: user.id,
      body: parsed.data.body,
      status: "PENDING",
      ipHash: hashIp(ip),
    },
  });

  await trackEvent({
    type: "COMMENT",
    entityType: "article",
    entitySlug: params.slug,
    userId: user.id,
    ip,
  });

  return NextResponse.json({ ok: true, id: comment.id, status: comment.status }, { status: 201 });
}
