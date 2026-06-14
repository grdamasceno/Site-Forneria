import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import Accordion, { type AccordionItem } from "@/components/Accordion";

export const metadata: Metadata = {
  title: "Dúvidas Frequentes — Forneria Original",
};

const faq: AccordionItem[] = [
  {
    question: "Porque as pizzas da Forneria Original não vão cortadas?",
    answer: [
      "Na Forneria Original a preocupação com a qualidade e o compromisso em oferecer a melhor experiência aos nossos clientes está nos mínimos detalhes. Da receita da massa à escolha da caixa, tudo é pensado para proporcionar àqueles que nos concedem a honra da escolha um verdadeiro momento original.",
      "Uma das características das nossas pizzas é o protagonismo dos recheios, feitos com ingredientes selecionados e servidos sempre em porções generosas. Mas, para investir nesse exagero de sabor e fazer com que elas cheguem até a sua casa nas mais perfeitas condições é preciso um cuidado especial. Por isso, as pizzas saem das lojas sempre inteiras, nunca fatiadas.",
      "O corte pode fazer o recheio escorrer, prejudica o transporte e ainda interfere no visual da apresentação, outro diferencial da nossa marca. Queremos que ao abrir a caixa você encontre a sua pizza perfeita, por isso é importante que ela seja entregue inteira.",
      "Ainda pensando nos detalhes, nosso programa de fidelidade presenteia os clientes a partir do 8º pedido com um cortador personalizado. O modelo escolhido foi pensado exatamente para realizar o corte preciso da sua pizza super recheada, sem prejudicar a experiência.",
      "Agora que você já sabe todos os detalhes que envolvem nossa entrega, basta escolher o seu sabor preferido e fazer o pedido! Bom apetite!",
    ],
  },
  {
    question: "Como eu posso fazer meu pedido?",
    answer: [
      "Você pode realizar o seu pedido na nossa Central de Atendimento a partir dos telefones informados no topo do site de acordo com a sua cidade, ou pelo nosso 0800-333-5555; também pode pedir no nosso App Forneria Original Oficial ou no iFood.",
    ],
  },
  {
    question: "Quais vantagens tenho de pedir com o aplicativo ou Central de Atendimento?",
    answer: [
      "Pedindo nesses canais você estará participando do nosso Programa de Fidelidade onde poderá alcançar níveis com premiações que vão de refrigerantes até pizzas ou escolher usar um cupom promocional que estiver disponível na época.",
    ],
  },
  {
    question: "Como posso registrar uma reclamação ou tirar uma dúvida com o SAC de vocês?",
    answer: [
      "Você pode acessar a página SAC e preencher o formulário aqui no nosso site ou ligar para a nossa Central de Atendimento.",
    ],
  },
  {
    question: "Vocês tem Whatsapp?",
    answer: ["Não temos whatsapp para pedidos."],
  },
  {
    question: "Vocês tem atendimento presencial?",
    answer: [
      "As nossas unidades tem o serviço de retirada (take out) no balcão.",
      "Temos apenas uma unidade com atendimento presencial em Recife, Pernambuco.",
      "Atendemos às segundas e terças-feira apenas com reservas no whatsapp: 81 99405-2142.",
      "Ou venha no nosso horário de funcionamento de quarta à domingo das 18h às 23h.",
      "Rua das Graças, 239.",
    ],
  },
  {
    question: "Vocês tem rodizio?",
    answer: ["Não. Atualmente não temos rodizio."],
  },
];

export default function DuvidasFrequentesPage() {
  return (
    <>
      <HeroBanner title="Dúvidas Frequentes" />
      <div className="container-fc max-w-3xl py-12">
        <Accordion items={faq} />
      </div>
    </>
  );
}
