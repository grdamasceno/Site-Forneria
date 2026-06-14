"use client";

import { useEffect, useState } from "react";

type Section = { title: string; intro?: string; items: string[] };

const sections: Section[] = [
  {
    title: "1. Elegibilidade",
    items: [
      "Para participar do Programa de Fidelidade, o cliente deve se cadastrar e estar de acordo com os nossos termos e políticas.",
      "Ao participar do programa, o cliente garante que suas informações cadastrais estão corretas e devidamente atualizadas, para fins de recebimento de comunicações referentes a premiação e condições gerais do programa.",
      "Ao participar do programa, o cliente declara-se conhecedor deste regulamento e ter aceito todas as regras e condições estipuladas para usufruir dos benefícios do mesmo.",
      "Estão aptas a participar do programa todas e quaisquer pessoas que possuem uma conta ativa em nossa loja. Sendo, portanto, os benefícios concedidos somente aos consumidores que se identificarem como usuários cadastrados.",
      "Em caso de tentativa de uso indevida e/ou fraudes, a loja reserva-se no direito de retirar os benefícios referentes ao cliente em questão.",
    ],
  },
  {
    title: "2. Regras e premiação",
    items: [
      "Ganhe prêmios após seu 2º, 5º, 8º, 11º, 14º, 17º, 20º pedido.",
      "O pedido só contabilizará no programa de fidelidade após ser aprovado pela loja.",
      "Para evitar fraudes e acúmulos indevidos, apenas pedidos feitos no intervalo de 6 horas serão contabilizados no programa.",
      "Após o resgate da última recompensa oferecida pelo programa, a pontuação será automaticamente zerada e a mecânica de acúmulo reiniciada.",
      "É expressamente proibido ao cliente participante praticar qualquer tipo de comercialização de pontuação ou recompensas obtidos através do programa, seja por cessão ou transferência. Se comprovada a prática, o cliente será imediatamente excluído do programa de fidelidade e terá sua pontuação zerada e a conta banida, independente de serem tomadas as medidas judiciais cabíveis.",
      "A mecânica de acúmulo e premiação do programa poderão ser alteradas a qualquer momento sem aviso prévio.",
      "O valor do frete não é contabilizado, apenas os valores do subtotal do pedido, que correspondem aos valores dos produtos adicionados ao carrinho.",
    ],
  },
  {
    title: "3. Resgate de prêmios",
    intro:
      "Ao somar a pontuação suficiente referente a mecânica do programa, o cliente terá direito a resgatar no pedido subsequente o(s) seguinte(s) prêmio(s):",
    items: [
      "Um refrigerante de 2l ou 1,5l de acordo com a disponibilidade.",
      "Um cortador personalizado Forneria.",
      "Uma borda recheada salgada. Colocar o sabor da borda e em qual pizza na observação do pedido.",
      "Borda recheada doce. Exceto nas pizzas de 20cm. Especificar o sabor da borda doce na observação e indicando em qual pizza deseja.",
      "Uma pizza doce 20cm qualquer sabor. Colocar o sabor na observação do pedido.",
      "Uma pizza salgada 30cm qualquer sabor. Colocar o sabor na observação do pedido.",
      "Uma pizza salgada 30cm (qualquer sabor) e uma pizza doce 20cm (qualquer sabor). Colocar o sabor na observação do pedido.",
      "Em cada etapa o resgate dos prêmios de fidelidade está condicionado a realização de um pedido pago em conjunto com a retirada do prêmio, exceto no vigésimo pedido onde o resgate poderá ser feito independente de um pedido pago.",
      "O resgate somente poderá ser feito pelo próprio cliente participante e deverá ser utilizado no prazo de validade do mesmo.",
      "As recompensas disponíveis para resgate só poderão ser utilizadas até a próxima premiação em questão. Caso o cliente não utilize a recompensa disponível até ganhar a subsequente, a recompensa anterior será perdida e não poderá ser utilizada. A loja não se responsabiliza por recompensas não resgatadas no período válido da mesma.",
      "A loja não se responsabiliza por produtos e serviços oferecidos por terceiros através de eventuais brindes concedidos.",
      "As recompensas disponíveis não são cumulativas, portanto, apenas uma recompensa pode ser resgatada por cada pedido.",
    ],
  },
  {
    title: "4. Validade do programa e recompensas",
    items: [
      "O presente Regulamento e o Programa de Fidelidade estará disponível de 01/05/2023 e será válido por tempo indeterminado.",
      "A loja reserva-se no direito de alterar a duração e a validade do programa, assim como encerrar as atividades do programa a qualquer momento.",
      "A loja poderá cancelar ou alterar este programa de fidelidade, bem como efetuar qualquer alteração neste regulamento, a qualquer momento. Sendo o programa e recompensas completamente zeradas em caso de cancelamento.",
    ],
  },
];

export default function RegulationModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-forneria-red px-8 py-3 font-bold uppercase text-white transition hover:bg-forneria-red-dark"
      >
        Regulamento Programa Fidelidade
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Regulamento do Programa de Fidelidade"
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-grad-dark flex items-center justify-between px-6 py-4 text-white">
              <h2 className="text-lg font-bold uppercase">
                Regulamento: Programa de Fidelidade
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="text-2xl leading-none transition hover:opacity-70"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5 text-forneria-black/80">
              {sections.map((section) => (
                <div key={section.title} className="mb-6 border-b border-forneria-red/30 pb-4 last:border-0">
                  <h3 className="mb-2 text-base font-bold text-forneria-black">
                    {section.title}
                  </h3>
                  {section.intro && <p className="mb-2 text-sm">{section.intro}</p>}
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
