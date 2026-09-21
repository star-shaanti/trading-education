import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import { isContentRole } from "@/lib/roles";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

/** Accès : ADMIN (complet) ou EDITOR (contenus et modération). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || !isContentRole(user.role)) {
    redirect("/connexion?callbackUrl=/admin");
  }

  return (
    <AdminShell email={user.email} role={user.role}>
      {children}
    </AdminShell>
  );
}
