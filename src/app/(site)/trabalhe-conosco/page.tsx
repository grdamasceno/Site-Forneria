import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import CareersForm from "@/components/CareersForm";

export const metadata: Metadata = {
  title: "Trabalhe Conosco — Forneria Original",
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
