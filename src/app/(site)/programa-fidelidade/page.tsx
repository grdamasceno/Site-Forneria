import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import LoyaltyTimeline from "@/components/LoyaltyTimeline";
import RegulationModal from "@/components/RegulationModal";

export const metadata: Metadata = {
  title: "Programa Fidelidade — Forneria Original",
};

export default function ProgramaFidelidadePage() {
  return (
    <>
      <HeroBanner
        title="Programa Fidelidade"
        image="/img/programa-fidelidade/bg-header.jpg"
        subtitle={
          <>
            <p>Acumule pontos, GANHE BRINDES E CORTESIAS DELICIOSAS.</p>
            <p>
              Para participar, basta fazer seu pedido através do aplicativo
              Forneria Original Oficial.
            </p>
          </>
        }
      />

      {/* Faixa branca separando o banner do corpo escuro */}
      <div className="h-16 bg-white md:h-20" />

      <LoyaltyTimeline />

      <section className="bg-white py-12">
        <div className="container-fc flex justify-center">
          <RegulationModal />
        </div>
      </section>
    </>
  );
}
