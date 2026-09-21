import { NextResponse } from "next/server";
import { contentTypeFor, readStoredFile } from "@/lib/storage";

/**
 * Sert les fichiers stockés localement (images des articles, couvertures).
 * Les PDF de rapports ne sont PAS servis ici : ils passent par
 * /api/rapports/[slug]/telecharger (comptage des téléchargements).
 */
export async function GET(
  _request: Request,
  { params }: { params: { key: string[] } }
) {
  const key = params.key.join("/");

  if (!key.startsWith("images/") || key.includes("..")) {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }

  try {
    const file = await readStoredFile(key);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentTypeFor(key),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }
}
