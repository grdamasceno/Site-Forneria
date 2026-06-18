import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contato / SAC — Forneria Original",
};

export default function SacPage() {
  return (
    <>
      <HeroBanner title="Contato" />

      <div className="container-fc py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: info + map */}
          <div>
            <h2 className="text-3xl font-light text-forneria-black md:text-4xl">
              Entre em contato
            </h2>
            <p className="mt-4 text-forneria-black/70">
              Para tirar dúvidas, elogios, sugestões ou reclamações, fale conosco:
            </p>
            <a
              href="mailto:sac@forneriaoriginal.com"
              className="text-forneria-red hover:underline"
            >
              sac@forneriaoriginal.com
            </a>

            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
              <iframe
                title="Mapa Forneria Original"
                src="https://www.google.com/maps?q=Rio+de+Janeiro&output=embed"
                className="h-[360px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: form */}
          <div>
            <p className="text-forneria-red">Para maiores informações</p>
            <h2 className="mb-6 text-3xl font-light text-forneria-black md:text-4xl">
              Preencha o formulário
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
