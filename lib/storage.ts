import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Stockage des fichiers (PDF des rapports, images des articles).
 *
 * Par défaut : disque local (`STORAGE_DIR`, volume persistant /app/storage
 * sur Coolify). Les rapports sont référencés en base par `storage:<cle>`
 * afin que le téléchargement passe par une route dédiée (comptage des
 * téléchargements + envoi email). Il est aussi possible de référencer une URL
 * absolue (Supabase Storage, S3, Drive…) : dans ce cas aucun fichier local.
 */

export type UploadFolder = "rapports" | "images";

const STORAGE_PREFIX = "storage:";

export function storageRoot(): string {
  return path.resolve(process.env.STORAGE_DIR || path.join(process.cwd(), "storage"));
}

export function isLocalFile(fileUrl: string): boolean {
  return fileUrl.startsWith(STORAGE_PREFIX);
}

export function keyFromFileUrl(fileUrl: string): string {
  return fileUrl.slice(STORAGE_PREFIX.length);
}

export function fileUrlFromKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

function resolveKey(key: string): string {
  const root = storageRoot();
  const absolute = path.resolve(root, key);
  if (!absolute.startsWith(root)) {
    throw new Error("Chemin de stockage invalide");
  }
  return absolute;
}

function limitsFor(folder: UploadFolder) {
  if (folder === "rapports") {
    return {
      maxBytes: Number(process.env.UPLOAD_PDF_MAX_MB ?? 25) * 1024 * 1024,
      types: ["application/pdf"],
      fallbackExt: ".pdf",
    };
  }
  return {
    maxBytes: Number(process.env.UPLOAD_IMAGE_MAX_MB ?? 5) * 1024 * 1024,
    types: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    fallbackExt: ".png",
  };
}

export async function saveUpload(
  file: File,
  folder: UploadFolder
): Promise<{ key: string; fileName: string; sizeBytes: number }> {
  const { maxBytes, types, fallbackExt } = limitsFor(folder);

  if (!file || file.size === 0) throw new Error("Fichier vide");
  if (file.size > maxBytes) {
    throw new Error(`Fichier trop volumineux (max ${Math.round(maxBytes / 1024 / 1024)} Mo)`);
  }
  if (file.type && !types.includes(file.type)) {
    throw new Error("Type de fichier non autorisé");
  }

  const ext = path.extname(file.name).toLowerCase() || fallbackExt;
  const key = `${folder}/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const absolute = resolveKey(key);

  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, Buffer.from(await file.arrayBuffer()));

  return { key, fileName: file.name, sizeBytes: file.size };
}

export async function readStoredFile(key: string): Promise<Buffer> {
  return fs.readFile(resolveKey(key));
}

export async function deleteStoredFile(key: string): Promise<void> {
  try {
    await fs.unlink(resolveKey(key));
  } catch {
    // Fichier déjà supprimé : on ignore.
  }
}

export function contentTypeFor(key: string): string {
  const ext = path.extname(key).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
