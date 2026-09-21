"use client";

import { useState } from "react";
import { buttonSecondaryClass, inputClass } from "@/lib/ui";

/**
 * Upload d'un fichier (PDF de rapport ou image) vers /api/admin/upload.
 * Renvoie l'URL à stocker dans le contenu (storage:<cle> ou /api/fichiers/...).
 */
export function UploadField({
  folder,
  onUploaded,
  label,
  accept,
}: {
  folder: "rapports" | "images";
  onUploaded: (result: { url: string; fileName: string; sizeBytes: number }) => void;
  label: string;
  accept: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        url?: string;
        fileName?: string;
        sizeBytes?: number;
      };

      if (!response.ok || !payload.url) throw new Error(payload.error ?? "Upload impossible.");
      onUploaded({
        url: payload.url,
        fileName: payload.fileName ?? file.name,
        sizeBytes: payload.sizeBytes ?? file.size,
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
        className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-brand-primary file:px-3 file:py-1.5 file:text-white`}
      />
      {busy && <p className="text-xs text-slate-500">Envoi en cours…</p>}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Alternative : coller une URL externe (Supabase Storage, S3, Drive…).
      </p>
    </div>
  );
}

/** Champ URL + upload, utilisé pour les PDF et les images. */
export function UploadOrUrlField({
  value,
  onChange,
  folder,
  label,
  accept,
  onUploaded,
}: {
  value: string;
  onChange: (value: string) => void;
  folder: "rapports" | "images";
  label: string;
  accept: string;
  onUploaded?: (result: { url: string; fileName: string; sizeBytes: number }) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="storage:rapports/… ou https://…"
        className={inputClass}
      />
      <UploadField
        folder={folder}
        label={label}
        accept={accept}
        onUploaded={(result) => {
          onChange(result.url);
          onUploaded?.(result);
        }}
      />
      <button type="button" className={buttonSecondaryClass} onClick={() => onChange("")}>
        Effacer
      </button>
    </div>
  );
}
