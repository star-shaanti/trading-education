import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/auth";
import { fileUrlFromKey, saveUpload, type UploadFolder } from "@/lib/storage";

/**
 * Upload des fichiers depuis l'admin (PDF des rapports, images).
 * multipart/form-data : `file` + `folder` ("rapports" | "images").
 * Renvoie `url` : "storage:<cle>" pour un PDF (comptage des téléchargements)
 * ou "/api/fichiers/<cle>" pour une image (servie publiquement).
 */
export async function POST(request: Request) {
  if (!(await requireContentManager())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const file = formData.get("file");
  const folder = (formData.get("folder") as UploadFolder | null) ?? "images";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  if (folder !== "rapports" && folder !== "images") {
    return NextResponse.json({ error: "Dossier non autorisé." }, { status: 400 });
  }

  try {
    const { key, fileName, sizeBytes } = await saveUpload(file, folder);
    return NextResponse.json({
      ok: true,
      key,
      fileName,
      sizeBytes,
      url: folder === "rapports" ? fileUrlFromKey(key) : `/api/fichiers/${key}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload impossible.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
