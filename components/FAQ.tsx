"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export function FAQ({ items, title = "Frequently Asked Questions" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">
            {title}
          </h2>
        )}
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="card p-6 border border-slate-200 dark:border-slate-800"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 pr-4">
                    {item.question}
                  </h3>
                  <span
                    className={`text-2xl transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="mt-4 prose-custom text-slate-600 dark:text-slate-400"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

