import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import CareersForm from "@/components/CareersForm";

export const metadata: Metadata = {
  title: "Trabalhe Conosco — Forneria Original",
  description:
    "Quer fazer parte do time Forneria Original? Envie seu currículo pelo formulário e concorra às vagas abertas em nossas unidades.",
  alternates: { canonical: "/trabalhe-conosco" },
};

export default function TrabalheConoscoPage() {
  return (
    <>
      <HeroBanner title="Trabalhe Conosco" />
      <div className="container-fc max-w-4xl py-12">
        <CareersForm />
      </div>
    </>
  );
}
