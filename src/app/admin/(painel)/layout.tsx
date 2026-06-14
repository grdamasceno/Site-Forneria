import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function PainelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const userName = (user.email ?? "Admin").split("@")[0];

  return (
    <div className="min-h-screen bg-forneria-gray">
      <AdminNav userName={userName} />
      <main className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">{children}</main>
    </div>
  );
}
