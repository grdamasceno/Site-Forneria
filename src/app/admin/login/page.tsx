"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const input =
    "w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-forneria-red";

  return (
    <div className="flex min-h-screen items-center justify-center bg-forneria-gray px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <span className="block font-heading text-2xl font-extrabold uppercase leading-[0.85] tracking-tight text-forneria-red">
            <span className="block">Forneria</span>
            <span className="block">Original</span>
          </span>
          <p className="mt-3 text-sm text-forneria-black/60">Retaguarda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={input}
          />
          {error && <p className="text-sm text-forneria-red">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-forneria-red py-3 font-bold text-white transition hover:bg-forneria-red-dark disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
