"use client";

import { useState } from "react";
import { submitSac } from "@/app/actions/forms";

/** SAC contact form — submits via SMTP to the configured e-mails. */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    const res = await submitSac(new FormData(form));
    if (res.ok) {
      setStatus("ok");
      form.reset();
    } else {
      setError(res.error ?? "Erro ao enviar.");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-forneria-red";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="nome" placeholder="Nome" required className={inputClass} />
      <input type="email" name="email" placeholder="Email" required className={inputClass} />
      <input type="tel" name="telefone" placeholder="Telefone" className={inputClass} />
      <input type="text" name="assunto" placeholder="Assunto" className={inputClass} />
      <textarea
        name="mensagem"
        placeholder="Mensagem"
        rows={5}
        required
        className={`${inputClass} resize-none`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-forneria-red px-8 py-3 font-bold text-white transition hover:bg-forneria-red-dark disabled:opacity-60"
      >
        {status === "loading" ? "Enviando..." : "Enviar"}
      </button>

      {status === "ok" && (
        <p className="text-sm font-medium text-green-600">
          Mensagem enviada! Em breve entraremos em contato.
        </p>
      )}
      {status === "error" && <p className="text-sm font-medium text-forneria-red">{error}</p>}
    </form>
  );
}
