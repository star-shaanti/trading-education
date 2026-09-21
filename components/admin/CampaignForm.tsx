"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonClass, buttonSecondaryClass, inputClass, labelClass } from "@/lib/ui";
import { FormMessage, Select, TextArea, TextInput } from "@/components/admin/fields";

/** Envoi d'emails groupés : test unitaire puis campagne complète. */
export function CampaignForm({
  audiences,
}: {
  audiences: Array<{ value: string; label: string }>;
}) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("<p>Bonjour,</p><p></p><p>Bonne lecture !</p>");
  const [audience, setAudience] = useState(audiences[0]?.value ?? "subscribers");
  const [testEmail, setTestEmail] = useState("");
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  async function send(mode: "test" | "campaign") {
    setState("saving");
    setMessage("");

    try {
      const response = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "test"
            ? { mode: "test", subject, bodyHtml, testEmail }
            : { mode: "campaign", subject, bodyHtml, audience }
        ),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        sent?: number;
        failed?: number;
        total?: number;
        status?: string;
      };
      if (!response.ok) throw new Error(payload.error ?? "Envoi impossible.");

      setState("ok");
      setMessage(
        mode === "test"
          ? `Email de test traité (statut : ${payload.status ?? "envoyé"}).`
          : `Campagne envoyée : ${payload.sent ?? 0} réussis, ${payload.failed ?? 0} échecs sur ${
              payload.total ?? 0
            } destinataires.`
      );
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Envoi impossible.");
    }
  }

  return (
    <div className="space-y-5">
      <TextInput label="Objet de l'email" value={subject} onChange={setSubject} required />
      <TextArea
        label="Contenu HTML"
        value={bodyHtml}
        onChange={setBodyHtml}
        rows={10}
        hint="Le gabarit (logo, pied de page, lien de désinscription) est ajouté automatiquement."
      />

      <Select label="Audience" value={audience} onChange={setAudience} options={audiences} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Email de test</label>
          <input
            type="email"
            value={testEmail}
            onChange={(event) => setTestEmail(event.target.value)}
            className={inputClass}
            placeholder="vous@exemple.com"
          />
        </div>
        <div className="flex items-end gap-3">
          <button
            type="button"
            className={buttonSecondaryClass}
            disabled={state === "saving" || !subject || !testEmail}
            onClick={() => send("test")}
          >
            Envoyer un test
          </button>
          <button
            type="button"
            className={buttonClass}
            disabled={state === "saving" || !subject}
            onClick={() => {
              if (window.confirm("Envoyer cette campagne à toute l'audience sélectionnée ?")) {
                void send("campaign");
              }
            }}
          >
            {state === "saving" ? "Envoi…" : "Envoyer la campagne"}
          </button>
        </div>
      </div>

      <FormMessage state={state} message={message} />
    </div>
  );
}
