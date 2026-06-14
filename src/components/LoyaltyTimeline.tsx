import Image from "next/image";

type Order = { n: number; prize?: string; note?: string };

// Loyalty program tiers (Forneria Original). Orders without a prize are plain
// milestones; orders with a prize show a highlighted reward card.
const orders: Order[] = [
  { n: 1 },
  { n: 2 },
  { n: 3, prize: "Um refrigerante 2l/1,5l! de acordo com a disponibilidade." },
  { n: 4 },
  { n: 5 },
  { n: 6, prize: "Um cortador personalizado Forneria." },
  { n: 7 },
  { n: 8 },
  { n: 9, prize: "Uma borda recheada salgada!", note: "Colocar o sabor da borda e em qual pizza na observação do pedido." },
  { n: 10 },
  { n: 11 },
  { n: 12, prize: "Borda recheada doce. (exceto nas pizzas de 20cm).", note: "Especificar o sabor da borda doce na observação e indicando em qual pizza deseja." },
  { n: 13 },
  { n: 14 },
  { n: 15, prize: "Uma pizza doce 20cm qualquer sabor!", note: "Colocar o sabor na observação do pedido." },
  { n: 16 },
  { n: 17 },
  { n: 18, prize: "Uma pizza salgada de 30cm qualquer sabor.", note: "Especificar o sabor na observação e indicando em qual pizza deseja." },
  { n: 19 },
  { n: 20 },
  { n: 21, prize: "Uma pizza salgada 30cm (qualquer sabor) e uma pizza doce 20cm (qualquer sabor).", note: "Colocar o sabor na observação do pedido." },
];

function Card({ order, side }: { order: Order; side: "left" | "right" }) {
  // Arrow pointing toward the central line.
  const arrow =
    side === "right"
      ? "before:-left-2 before:border-y-8 before:border-r-8 before:border-y-transparent"
      : "before:-right-2 before:border-y-8 before:border-l-8 before:border-y-transparent";

  if (!order.prize) {
    return (
      <div
        className={`relative inline-block bg-forneria-red px-6 py-4 text-center font-bold uppercase text-white shadow-md before:absolute before:top-1/2 before:-translate-y-1/2 before:content-[''] ${arrow} ${
          side === "right" ? "before:border-r-forneria-red" : "before:border-l-forneria-red"
        }`}
      >
        {order.n}º Pedido
      </div>
    );
  }

  return (
    <div
      style={{ animationDelay: `${(order.n % 6) * 0.5}s` }}
      className={`animate-float relative inline-block max-w-xs rounded-sm border-[3px] border-forneria-red bg-white px-5 py-4 text-left text-forneria-red shadow-md before:absolute before:top-1/2 before:-translate-y-1/2 before:content-[''] ${arrow} ${
        side === "right" ? "before:border-r-white" : "before:border-l-white"
      }`}
    >
      <p className="font-bold uppercase">{order.n}º Pedido</p>
      <p className="mt-1 text-sm">
        Você ganhou: <strong>{order.prize}</strong>
      </p>
      {order.note && (
        <p className="mt-3 bg-forneria-red px-3 py-2 text-xs text-white shadow">
          {order.note}
        </p>
      )}
    </div>
  );
}

export default function LoyaltyTimeline() {
  return (
    <section className="relative overflow-hidden bg-forneria-black py-20">
      <Image
        src="/img/programa-fidelidade/bg-corpo.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="container-fc relative">
        <div className="mx-auto max-w-3xl">
          {/* Top: runner on a short horizontal white bar */}
          <div className="flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/programa-fidelidade/ico-boneco.gif"
              alt=""
              className="relative left-5 z-10 h-12 w-auto translate-y-[2px]"
            />
            <span className="h-[6px] w-40 bg-white" />
          </div>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Central vertical line */}
            <span className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-white" />

            <ul className="relative space-y-8 pt-8">
            {orders.map((order, i) => {
              const side: "left" | "right" = i % 2 === 0 ? "right" : "left";
              return (
                <li
                  key={order.n}
                  className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4"
                >
                  <div className="flex justify-end">
                    {side === "left" && <Card order={order} side="left" />}
                  </div>

                  <span className="relative z-10 h-5 w-5 rounded-full bg-forneria-red ring-4 ring-white" />

                  <div className="flex justify-start">
                    {side === "right" && <Card order={order} side="right" />}
                  </div>
                </li>
              );
            })}
            </ul>
          </div>

          {/* Bottom: celebrating figure on a short horizontal white bar */}
          <div className="flex flex-col items-center">
            <span className="h-[6px] w-40 bg-white" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/programa-fidelidade/ico-boneco-2.gif"
              alt=""
              className="z-10 h-16 w-auto -translate-y-[2px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
