"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import type { Dict } from "@/lib/i18n";
import { buttonClass, errorClass, inputClass, successClass } from "@/lib/ui";

type Comment = { id: string; body: string; createdAt: string; author: string };

/** Commentaires d'un article : lecture publique, écriture réservée aux membres. */
export function CommentSection({
  articleSlug,
  labels,
  isAuthenticated,
}: {
  articleSlug: string;
  labels: Dict["article"];
  isAuthenticated: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    void fetch(`/api/articles/${articleSlug}/commentaires`)
      .then((response) => (response.ok ? response.json() : { comments: [] }))
      .then((payload: { comments?: Comment[] }) => {
        if (active) setComments(payload.comments ?? []);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [articleSlug]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`/api/articles/${articleSlug}/commentaires`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Erreur");

      setBody("");
      setStatus("sent");
      setMessage(labels.commentPending);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : labels.noComments);
    }
  }

  return (
    <section className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        {labels.comments} ({comments.length})
      </h2>

      {isAuthenticated ? (
        <form onSubmit={onSubmit} className="mb-8 space-y-3">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={4}
            required
            minLength={5}
            maxLength={2000}
            placeholder={labels.commentPlaceholder}
            className={inputClass}
          />
          <button type="submit" disabled={status === "loading"} className={buttonClass}>
            {status === "loading" ? "…" : labels.submitComment}
          </button>
          {status === "sent" && <p className={successClass}>{message}</p>}
          {status === "error" && <p className={errorClass}>{message}</p>}
        </form>
      ) : (
        <p className="mb-8 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
          {labels.commentLogin}{" "}
          <Link href="/connexion" className="text-brand-primary hover:underline font-medium">
            →
          </Link>
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">{labels.noComments}</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {comment.author}
                <span className="ms-3 text-xs font-normal text-slate-500 dark:text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
                {comment.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
