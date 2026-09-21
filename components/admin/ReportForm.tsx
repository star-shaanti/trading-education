"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonClass, buttonDangerClass, buttonSecondaryClass } from "@/lib/ui";
import { Checkbox, FormMessage, Select, TextArea, TextInput } from "@/components/admin/fields";
import { UploadOrUrlField } from "@/components/admin/UploadField";

export type ReportFormValues = {
  id?: string;
  slug: string;
  title: string;
  titleFr: string;
  summary: string;
  summaryFr: string;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  periodLabel: string;
  status: string;
  featured: boolean;
  categoryId: string;
  tags: string;
};

const EMPTY: ReportFormValues = {
  slug: "",
  title: "",
  titleFr: "",
  summary: "",
  summaryFr: "",
  fileUrl: "",
  fileName: "",
  fileSizeBytes: 0,
  periodLabel: "",
  status: "DRAFT",
  featured: false,
  categoryId: "",
  tags: "",
};

/**
 * Formulaire de rapport PDF (admin).
 * Publier un rapport déclenche l'email « nouveau rapport » aux abonnés opt-in.
 */
export function ReportForm({
  initial,
  categories,
}: {
  initial?: Partial<ReportFormValues>;
  categories: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ReportFormValues>({ ...EMPTY, ...initial });
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  function set<K extends keyof ReportFormValues>(key: K, value: ReportFormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setMessage("");

    try {
      const response = await fetch(
        values.id ? `/api/admin/rapports/${values.id}` : "/api/admin/rapports",
        {
          method: values.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: values.slug,
            title: values.title,
            titleFr: values.titleFr,
            summary: values.summary,
            summaryFr: values.summaryFr,
            fileUrl: values.fileUrl,
            fileName: values.fileName,
            fileSizeBytes: Number(values.fileSizeBytes) || undefined,
            periodLabel: values.periodLabel,
            status: values.status,
            featured: values.featured,
            categoryId: values.categoryId,
            tags: values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          }),
        }
      );
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Enregistrement impossible.");

      setState("ok");
      setMessage(
        values.status === "PUBLISHED"
          ? "Rapport enregistré. Les abonnés sont notifiés lors d'une première publication."
          : "Rapport enregistré."
      );
      router.refresh();
      if (!values.id) router.push("/admin/rapports");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");
    }
  }

  async function remove() {
    if (!values.id || !window.confirm("Supprimer ce rapport ?")) return;
    await fetch(`/api/admin/rapports/${values.id}`, { method: "DELETE" });
    router.push("/admin/rapports");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          label="Titre (EN)"
          value={values.title}
          onChange={(value) => set("title", value)}
          required
        />
        <TextInput
          label="Titre (FR)"
          value={values.titleFr}
          onChange={(value) => set("titleFr", value)}
        />
      </div>

      <TextInput
        label="Slug (URL)"
        value={values.slug}
        onChange={(value) => set("slug", value)}
        required
      />

      <div className="grid gap-5 md:grid-cols-2">
        <TextArea
          label="Résumé (EN)"
          value={values.summary}
          onChange={(value) => set("summary", value)}
          rows={3}
        />
        <TextArea
          label="Résumé (FR)"
          value={values.summaryFr}
          onChange={(value) => set("summaryFr", value)}
          rows={3}
        />
      </div>

      <UploadOrUrlField
        label="Fichier PDF (upload)"
        folder="rapports"
        accept="application/pdf"
        value={values.fileUrl}
        onChange={(value) => set("fileUrl", value)}
        onUploaded={(result) => {
          set("fileName", result.fileName);
          set("fileSizeBytes", result.sizeBytes);
        }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        <TextInput
          label="Période affichée"
          value={values.periodLabel}
          onChange={(value) => set("periodLabel", value)}
          hint="Ex. Semaine 38 — 2026"
        />
        <Select
          label="Statut"
          value={values.status}
          onChange={(value) => set("status", value)}
          options={[
            { value: "DRAFT", label: "Brouillon" },
            { value: "PUBLISHED", label: "Publié (notifie les abonnés)" },
            { value: "ARCHIVED", label: "Archivé" },
          ]}
        />
        <Select
          label="Catégorie"
          value={values.categoryId}
          onChange={(value) => set("categoryId", value)}
          options={[
            { value: "", label: "— Aucune —" },
            ...categories.map((category) => ({ value: category.id, label: category.name })),
          ]}
        />
      </div>

      <TextInput
        label="Mots-clés (séparés par des virgules)"
        value={values.tags}
        onChange={(value) => set("tags", value)}
      />

      <Checkbox
        label="Rapport mis en avant"
        checked={values.featured}
        onChange={(checked) => set("featured", checked)}
      />

      <FormMessage state={state} message={message} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state === "saving"} className={buttonClass}>
          {state === "saving" ? "…" : "Enregistrer"}
        </button>
        <button
          type="button"
          className={buttonSecondaryClass}
          onClick={() => router.push("/admin/rapports")}
        >
          Retour à la liste
        </button>
        {values.id && (
          <button type="button" className={buttonDangerClass} onClick={remove}>
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
}
