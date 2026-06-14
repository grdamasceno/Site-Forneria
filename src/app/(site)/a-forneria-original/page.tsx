import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import ContentSection from "@/components/ContentSection";

export const metadata: Metadata = {
  title: "A Forneria Original",
};

export default function AForneriaOriginalPage() {
  return (
    <>
      <HeroBanner title="A Forneria Original" />

      <ContentSection
        title="A Forneria Original"
        text="Bem-vindo à Forneria Original, onde a pizza é levada a sério. Somos uma rede de franquias especializada em delivery de pizzas artesanais, feitas com ingredientes selecionados e com o sabor original que você merece. Aqui, a pizza não é apenas mais uma — é a melhor que podemos fazer. Acreditamos que pizzas são especiais, uma combinação perfeita para o paladar de todos. Democráticas, as pizzas agradam tanto aos gourmets quanto àqueles que costumam ser mais exigentes."
        image="/img/quem-somos/destaque.jpg"
        imageLeft
      />
    </>
  );
}
