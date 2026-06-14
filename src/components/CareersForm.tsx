"use client";

import { useState } from "react";
import { units } from "@/lib/data";
import { submitTrabalhe } from "@/app/actions/forms";

const inputClass =
  "w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-forneria-red";

// Unit names for the "unidade de interesse" checkboxes.
const unitNames = Array.from(new Set(units.map((u) => u.name)));

/** "Trabalhe Conosco" form — submits via SMTP to the configured e-mails. */
export default function CareersForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    const res = await submitTrabalhe(new FormData(form));
    if (res.ok) {
      setStatus("ok");
      form.reset();
    } else {
      setError(res.error ?? "Erro ao enviar.");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border border-forneria-red/40 p-6 md:p-10">
      <p className="text-forneria-red">Preencha o formulário</p>
      <h2 className="text-3xl font-light text-forneria-black md:text-4xl">
        Cadastre-se para participar do processo seletivo.
      </h2>
      <p className="mt-2 font-bold text-forneria-black">
        Após o preenchimento aguarde o contato de nossa equipe BOA SORTE!!!
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input type="text" name="nome" placeholder="Nome" required className={inputClass} />
        <input type="email" name="email" placeholder="Email" required className={inputClass} />
        <input type="tel" name="telefone" placeholder="Telefone" className={inputClass} />
        <input type="text" name="area" placeholder="área pretendida" className={inputClass} />

        <div>
          <label className="mb-1 block text-sm font-medium text-forneria-black/70">
            Currículo
          </label>
          <input
            type="file"
            name="curriculo"
            accept=".pdf,.doc,.docx"
            className="block w-full text-sm text-forneria-black/70 file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-forneria-gray file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
          />
        </div>

        <fieldset className="pt-2">
          <legend className="mb-2 text-sm font-semibold text-forneria-black">
            Unidade(s) de interesse
          </legend>
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {unitNames.map((name) => (
              <label key={name} className="flex items-center gap-2 text-sm text-forneria-black/80">
                <input type="checkbox" name="unidades" value={name} className="accent-forneria-red" />
                {name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 rounded-md bg-forneria-red px-8 py-3 font-bold text-white transition hover:bg-forneria-red-dark disabled:opacity-60"
          >
            {status === "loading" ? "Enviando..." : "Enviar"}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        {status === "ok" && (
          <p className="text-center text-sm font-medium text-green-600">
            Cadastro enviado! Aguarde o contato da nossa equipe. Boa sorte!
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-sm font-medium text-forneria-red">{error}</p>
        )}
      </form>
    </div>
  );
}
