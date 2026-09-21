import { WebinarForm } from "@/components/admin/WebinarForm";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Création (`/admin/webinaires/nouveau`) ou édition (`/admin/webinaires/<id>`). */
export default async function AdminWebinarEditPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "nouveau";

  const [categories, webinar] = await Promise.all([
    getCategories("WEBINAR"),
    isNew
      ? Promise.resolve(null)
      : prisma.webinar.findUnique({ where: { id: params.id }, include: { tags: true } }),
  ]);

  /** `datetime-local` attend le format AAAA-MM-JJTHH:MM. */
  const toLocalInput = (date: Date | null) =>
    date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {isNew ? "Nouveau webinaire" : "Modifier le webinaire"}
      </h2>

      <WebinarForm
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        initial={
          webinar
            ? {
                id: webinar.id,
                slug: webinar.slug,
                title: webinar.title,
                titleFr: webinar.titleFr ?? "",
                description: webinar.description,
                descriptionFr: webinar.descriptionFr ?? "",
                platform: webinar.platform,
                startsAt: toLocalInput(webinar.startsAt),
                endsAt: toLocalInput(webinar.endsAt),
                joinUrl: webinar.joinUrl ?? "",
                replayUrl: webinar.replayUrl ?? "",
                coverImage: webinar.coverImage ?? "",
                capacity: webinar.capacity ? String(webinar.capacity) : "",
                status: webinar.status,
                publish: Boolean(webinar.publishedAt),
                categoryId: webinar.categoryId ?? "",
                tags: webinar.tags.map((tag) => tag.name).join(", "),
              }
            : undefined
        }
      />
    </div>
  );
}
