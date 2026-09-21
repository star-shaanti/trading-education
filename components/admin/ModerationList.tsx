"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonDangerClass, buttonSecondaryClass } from "@/lib/ui";

type CommentRow = {
  id: string;
  body: string;
  status: string;
  createdAt: string;
  authorEmail: string;
  authorName: string | null;
  articleSlug: string;
  articleTitle: string;
};

/** Modération des commentaires : approuver, rejeter ou remettre en attente. */
export function ModerationList({ comments }: { comments: CommentRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function moderate(commentId: string, status: "APPROVED" | "REJECTED" | "PENDING") {
    setBusy(commentId);
    await fetch("/api/admin/commentaires", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, status }),
    }).catch(() => null);
    setBusy(null);
    router.refresh();
  }

  if (comments.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Aucun commentaire.</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong className="text-slate-700 dark:text-slate-200">
                {comment.authorName ?? comment.authorEmail}
              </strong>{" "}
              · {new Date(comment.createdAt).toLocaleString("fr-FR")}
            </span>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5">
              {comment.status}
            </span>
          </div>

          <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-200">
            {comment.body}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sur :{" "}
            <a
              href={`/analyses/${comment.articleSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              {comment.articleTitle}
            </a>
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy === comment.id}
              onClick={() => moderate(comment.id, "APPROVED")}
              className={buttonSecondaryClass}
            >
              ✅ Approuver
            </button>
            <button
              type="button"
              disabled={busy === comment.id}
              onClick={() => moderate(comment.id, "PENDING")}
              className={buttonSecondaryClass}
            >
              ↩ En attente
            </button>
            <button
              type="button"
              disabled={busy === comment.id}
              onClick={() => moderate(comment.id, "REJECTED")}
              className={buttonDangerClass}
            >
              Rejeter
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
