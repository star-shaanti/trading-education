"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonClass, buttonDangerClass, buttonSecondaryClass } from "@/lib/ui";
import { Checkbox, FormMessage, Select, TextArea, TextInput } from "@/components/admin/fields";

export type WebinarFormValues = {
  id?: string;
  slug: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  platform: string;
  startsAt: string;
  endsAt: string;
  joinUrl: string;
  replayUrl: string;
  coverImage: string;
  capacity: string;
  status: string;
  publish: boolean;
  categoryId: string;
  tags: string;
};

const EMPTY: WebinarFormValues = {
  slug: "",
  title: "",
  titleFr: "",
  description: "",
  descriptionFr: "",
  platform: "zoom",
  startsAt: "",
  endsAt: "",
  joinUrl: "",
  replayUrl: "",
  coverImage: "",
  capacity: "",
  status: "SCHEDULED",
  publish: true,
  categoryId: "",
  tags: "",
};

/** Formulaire de webinaire (admin) — lien Zoom/Google Meet/YouTube + replay. */
export function WebinarForm({
  initial,
  categories,
}: {
  initial?: Partial<WebinarFormValues>;
  categories: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<WebinarFormValues>({ ...EMPTY, ...initial });
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  function set<K extends keyof WebinarFormValues>(key: K, value: WebinarFormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setMessage("");

    try {
      const response = await fetch(
        values.id ? `/api/admin/webinaires/${values.id}` : "/api/admin/webinaires",
        {
          method: values.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: values.slug,
            title: values.title,
            titleFr: values.titleFr,
            description: values.description,
            descriptionFr: values.descriptionFr,
            platform: values.platform,
            startsAt: values.startsAt,
            endsAt: values.endsAt,
            joinUrl: values.joinUrl,
            replayUrl: values.replayUrl,
            coverImage: values.coverImage,
            capacity: values.capacity ? Number(values.capacity) : undefined,
            status: values.status,
            publish: values.publish,
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
      setMessage("Webinaire enregistré.");
      router.refresh();
      if (!values.id) router.push("/admin/webinaires");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");
    }
  }

  async function remove() {
    if (!values.id || !window.confirm("Supprimer ce webinaire ?")) return;
    await fetch(`/api/admin/webinaires/${values.id}`, { method: "DELETE" });
    router.push("/admin/webinaires");
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
          label="Description (EN) — HTML"
          value={values.description}
          onChange={(value) => set("description", value)}
          rows={5}
        />
        <TextArea
          label="Description (FR) — HTML"
          value={values.descriptionFr}
          onChange={(value) => set("descriptionFr", value)}
          rows={5}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <TextInput
          label="Début (date et heure locale)"
          type="datetime-local"
          value={values.startsAt}
          onChange={(value) => set("startsAt", value)}
          required
        />
        <TextInput
          label="Fin (optionnel)"
          type="datetime-local"
          value={values.endsAt}
          onChange={(value) => set("endsAt", value)}
        />
        <Select
          label="Plateforme"
          value={values.platform}
          onChange={(value) => set("platform", value)}
          options={[
            { value: "zoom", label: "Zoom" },
            { value: "meet", label: "Google Meet" },
            { value: "youtube", label: "YouTube Live" },
            { value: "other", label: "Autre" },
          ]}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          label="Lien de connexion (Zoom / Meet)"
          value={values.joinUrl}
          onChange={(value) => set("joinUrl", value)}
        />
        <TextInput
          label="Lien du replay (optionnel)"
          value={values.replayUrl}
          onChange={(value) => set("replayUrl", value)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <TextInput
          label="Image de couverture (URL)"
          value={values.coverImage}
          onChange={(value) => set("coverImage", value)}
        />
        <TextInput
          label="Capacité (places)"
          type="number"
          value={values.capacity}
          onChange={(value) => set("capacity", value)}
        />
        <Select
          label="Statut"
          value={values.status}
          onChange={(value) => set("status", value)}
          options={[
            { value: "SCHEDULED", label: "Programmé" },
            { value: "LIVE", label: "En direct" },
            { value: "ENDED", label: "Terminé (replay)" },
            { value: "CANCELED", label: "Annulé" },
          ]}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
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
          label="Mots-clés (séparés par des virgules)"
          value={values.tags}
          onChange={(value) => set("tags", value)}
        />
      </div>

      <Checkbox
        label="Publier la page du webinaire"
        checked={values.publish}
        onChange={(checked) => set("publish", checked)}
      />

      <FormMessage state={state} message={message} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state === "saving"} className={buttonClass}>
          {state === "saving" ? "…" : "Enregistrer"}
        </button>
        <button
          type="button"
          className={buttonSecondaryClass}
          onClick={() => router.push("/admin/webinaires")}
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
