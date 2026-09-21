"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonClass, buttonDangerClass, buttonSecondaryClass } from "@/lib/ui";
import { Checkbox, FormMessage, Select, TextArea, TextInput } from "@/components/admin/fields";
import { UploadOrUrlField } from "@/components/admin/UploadField";

export type ArticleFormValues = {
  id?: string;
  slug: string;
  title: string;
  titleFr: string;
  excerpt: string;
  excerptFr: string;
  contentHtml: string;
  contentHtmlFr: string;
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  status: string;
  featured: boolean;
  readingMinutes: number;
  categoryId: string;
  tags: string;
};

const EMPTY: ArticleFormValues = {
  slug: "",
  title: "",
  titleFr: "",
  excerpt: "",
  excerptFr: "",
  contentHtml: "",
  contentHtmlFr: "",
  coverImage: "",
  seoTitle: "",
  seoDescription: "",
  status: "DRAFT",
  featured: false,
  readingMinutes: 6,
  categoryId: "",
  tags: "",
};

/** Formulaire de création / édition d'une analyse (admin). */
export function ArticleForm({
  initial,
  categories,
}: {
  initial?: Partial<ArticleFormValues>;
  categories: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ArticleFormValues>({ ...EMPTY, ...initial });
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  function set<K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setMessage("");

    const body = {
      slug: values.slug,
      title: values.title,
      titleFr: values.titleFr,
      excerpt: values.excerpt,
      excerptFr: values.excerptFr,
      contentHtml: values.contentHtml,
      contentHtmlFr: values.contentHtmlFr,
      coverImage: values.coverImage,
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
      status: values.status,
      featured: values.featured,
      readingMinutes: Number(values.readingMinutes) || 6,
      categoryId: values.categoryId,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch(
        values.id ? `/api/admin/articles/${values.id}` : "/api/admin/articles",
        {
          method: values.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Enregistrement impossible.");

      setState("ok");
      setMessage("Analyse enregistrée.");
      router.refresh();
      if (!values.id) router.push("/admin/articles");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");
    }
  }

  async function remove() {
    if (!values.id || !window.confirm("Supprimer cette analyse ?")) return;
    await fetch(`/api/admin/articles/${values.id}`, { method: "DELETE" });
    router.push("/admin/articles");
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
        hint="Minuscules et tirets uniquement — ex. fed-taux-2026"
        required
      />

      <div className="grid gap-5 md:grid-cols-2">
        <TextArea
          label="Chapeau (EN)"
          value={values.excerpt}
          onChange={(value) => set("excerpt", value)}
          rows={3}
        />
        <TextArea
          label="Chapeau (FR)"
          value={values.excerptFr}
          onChange={(value) => set("excerptFr", value)}
          rows={3}
        />
      </div>

      <TextArea
        label="Contenu (EN) — HTML"
        value={values.contentHtml}
        onChange={(value) => set("contentHtml", value)}
        rows={10}
      />
      <TextArea
        label="Contenu (FR) — HTML"
        value={values.contentHtmlFr}
        onChange={(value) => set("contentHtmlFr", value)}
        rows={10}
      />

      <UploadOrUrlField
        label="Image de couverture (upload)"
        folder="images"
        accept="image/*"
        value={values.coverImage}
        onChange={(value) => set("coverImage", value)}
      />

      <div className="grid gap-5 md:grid-cols-3">
        <Select
          label="Statut"
          value={values.status}
          onChange={(value) => set("status", value)}
          options={[
            { value: "DRAFT", label: "Brouillon" },
            { value: "PUBLISHED", label: "Publié" },
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
        <TextInput
          label="Temps de lecture (min)"
          type="number"
          value={String(values.readingMinutes)}
          onChange={(value) => set("readingMinutes", Number(value))}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          label="Mots-clés (séparés par des virgules)"
          value={values.tags}
          onChange={(value) => set("tags", value)}
          hint="Ex. inflation, banques centrales, forex"
        />
        <TextInput
          label="Titre SEO (optionnel)"
          value={values.seoTitle}
          onChange={(value) => set("seoTitle", value)}
        />
      </div>

      <TextInput
        label="Description SEO (optionnel)"
        value={values.seoDescription}
        onChange={(value) => set("seoDescription", value)}
      />

      <Checkbox
        label="Mettre en avant sur la page d'accueil"
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
          onClick={() => router.push("/admin/articles")}
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
