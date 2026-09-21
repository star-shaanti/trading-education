import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/auth";
import { saveWebinar } from "@/lib/admin-content";
import { prisma } from "@/lib/prisma";
import { webinarInputSchema } from "@/lib/validation";

/** Liste (admin) des webinaires. */
export async function GET() {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const webinars = await prisma.webinar.findMany({
    orderBy: { startsAt: "desc" },
    take: 200,
    include: { category: true, _count: { select: { registrations: true } } },
  });

  return NextResponse.json({ webinars });
}

/** Création d'un webinaire. */
export async function POST(request: Request) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = webinarInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Données invalides." },
      { status: 400 }
    );
  }

  try {
    const webinar = await saveWebinar({ ...parsed.data, id: undefined });
    return NextResponse.json({ ok: true, webinar }, { status: 201 });
  } catch (error) {
    console.error("[admin/webinaires] création impossible", error);
    return NextResponse.json({ error: "Création impossible." }, { status: 500 });
  }
}
