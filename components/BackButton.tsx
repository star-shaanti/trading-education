"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangContext";
import { getDict } from "@/lib/i18n/dict";

export default function BackButton() {
  const router = useRouter();
  const { lang } = useLang();
  const label = getDict(lang).common.back;
  return (
    <div className="mb-4">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        aria-label={label}
      >
        <span className="inline-block rtl:-scale-x-100" aria-hidden="true">
          ←
        </span>{" "}
        {label}
      </button>
    </div>
  );
}


