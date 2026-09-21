import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { csvResponse, toCsv } from "@/lib/csv";
import { prisma } from "@/lib/prisma";

/**
 * Gestion des inscrits (admin) :
 * - GET              : liste JSON (recherche `?q=`, pagination `?page=`) ;
 * - GET `?format=csv`: export CSV de tous les abonnés et membres.
 */
export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  const query = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const perPage = 50;

  const [subscribers, total] = await Promise.all([
    prisma.subscriber.findMany({
      where: query
        ? {
            OR: [
              { email: { contains: query, mode: "insensitive" } },
              { name: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.subscriber.count(),
  ]);

  if (format === "csv") {
    const csv = toCsv(
      subscribers.map((subscriber) => ({
        email: subscriber.email,
        prenom: subscriber.name ?? "",
        source: subscriber.source,
        langue: subscriber.locale,
        inscrit_le: subscriber.createdAt,
        confirme_le: subscriber.confirmedAt ?? "",
        newsletter: subscriber.newsletterOptIn ? "oui" : "non",
        rapports: subscriber.reportsOptIn ? "oui" : "non",
        webinaires: subscriber.webinarsOptIn ? "oui" : "non",
        desinscrit_le: subscriber.unsubscribedAt ?? "",
      })),
      [
        "email",
        "prenom",
        "source",
        "langue",
        "inscrit_le",
        "confirme_le",
        "newsletter",
        "rapports",
        "webinaires",
        "desinscrit_le",
      ]
    );
    return csvResponse(`abonnes-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  const members = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      _count: { select: { downloads: true, comments: true, webinarRegistrations: true } },
    },
  });

  return NextResponse.json({
    subscribers,
    members,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
  });
}
