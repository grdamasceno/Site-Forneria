"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const items = [
  { label: "A Forneria Original", href: "/admin" },
  { label: "Cardápio", href: "/admin/cardapio" },
  { label: "Marcas", href: "/admin/marcas" },
  { label: "Unidades", href: "/admin/unidades" },
  { label: "Novidades", href: "/admin/novidades" },
  { label: "Páginas", href: "/admin/paginas" },
  { label: "Usuários", href: "/admin/usuarios" },
];

export default function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await createBrowserSupabase().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-forneria-red text-white">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-4 py-3 lg:px-8">
        <Link href="/admin" className="shrink-0 font-heading text-xl font-extrabold uppercase leading-[0.85]">
          <span className="block">Forneria</span>
          <span className="block">Original</span>
        </Link>

        <nav className="flex flex-1 flex-wrap items-center justify-center gap-1">
          {items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                  active ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-semibold sm:inline">Olá, {userName}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-md bg-forneria-red-dark px-4 py-1.5 text-sm font-semibold transition hover:bg-black/20"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
