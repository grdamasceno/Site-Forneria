import type { Metadata } from "next";
import Image from "next/image";
import HeroBanner from "@/components/HeroBanner";

export const metadata: Metadata = {
  title: "Fornelover — Forneria Original",
};

type Testimonial = {
  name: string;
  text: string;
  unit?: string;
  network: "facebook" | "instagram";
  heart?: boolean;
};

const testimonials: Testimonial[] = [
  {
    name: "Amanda",
    network: "facebook",
    heart: true,
    text:
      'Acabei de avaliar a outra e surrealmente está estava melhor... Sabe aquele ditado "um raio não cai 6x no mesmo lugar?". Essa pizzaria consegue fazer cair até 1000x no mesmo lugar pois nossa senhora!!! Só sucesso!! Gostaria de dar 10 estrelas!! Com carinho, sou fã!!!',
    unit: "Unidade Freguesia",
  },
  {
    name: "Juliana",
    network: "instagram",
    text:
      "Melhor pizza que comi nos últimos tempos. Ganhou até mesmo de algumas pizzarias de São Paulo. Estão de parabéns!!",
    unit: "Unidade Barra da Tijuca",
  },
  {
    name: "Juliana",
    network: "facebook",
    text: "A 8ª maravilha do mundo moderno!!!",
  },
  {
    name: "Karen",
    network: "instagram",
    text: "Amo! Você sente o sabor de produto de qualidade!",
  },
];

function NetworkIcon({ network }: { network: Testimonial["network"] }) {
  const src = network === "facebook" ? "/img/fornelover/ico-face.png" : "/img/fornelover/ico-insta.png";
  return (
    <Image
      src={src}
      alt={network === "facebook" ? "Comentário no Facebook" : "Curtida no Instagram"}
      width={800}
      height={800}
      className="animate-float mx-auto h-auto w-64 md:w-96"
    />
  );
}

export default function ForneloverPage() {
  return (
    <>
      <HeroBanner title="Fornelover" />

      {/* Top red wave */}
      <Image
        src="/img/fornelover/bg-header.png"
        alt=""
        width={2003}
        height={467}
        priority
        className="-mt-1 h-auto w-full"
      />

      {/* Intro */}
      <section className="bg-forneria-gray">
        <div className="container-fc py-12 text-center">
          <h2 className="font-heading text-4xl font-extrabold uppercase leading-tight md:text-6xl">
            <span className="text-forneria-red">Nosso </span>
            <span className="text-forneria-black">Melhor Momento </span>
            <span className="text-forneria-red">é Sempre com </span>
            <span className="text-forneria-black">Você !!!</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-forneria-black/70">
            Na reunião da galera, no happy hour do trabalho, na maratona de séries,
            na comemoração de fim de semana. Com a família, com os amigos, com o
            crush, com o doguinho ou sozinho...
          </p>

          <p className="mt-10 text-2xl font-bold text-forneria-red">Não importa!</p>
          <p className="mt-1 text-xl text-forneria-black/80">
            Nosso encontro é sempre nosso maior momento!
          </p>
          <p className="mt-6 text-xl text-forneria-black/80">
            Compartilha ele com a gente
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white">
        <div className="container-fc divide-y divide-dashed divide-forneria-red/40">
          {testimonials.map((t, i) => {
            const imageLeft = t.network === "facebook";
            const iconCol = (
              <div>
                <NetworkIcon network={t.network} />
              </div>
            );
            const textCol = (
              <div>
                <h3 className="text-2xl font-bold text-forneria-red">{t.name}</h3>
                <p className="mt-4 text-lg leading-relaxed text-forneria-black/80">
                  {t.text}
                </p>
                {t.unit && (
                  <p className="mt-4 font-semibold text-forneria-red">{t.unit}</p>
                )}
              </div>
            );
            return (
              <div
                key={`${t.name}-${i}`}
                className={`grid grid-cols-1 items-center gap-8 py-12 ${
                  t.heart ? "md:grid-cols-[1fr_1fr_auto]" : "md:grid-cols-2"
                }`}
              >
                {imageLeft ? (
                  <>
                    {iconCol}
                    {textCol}
                  </>
                ) : (
                  <>
                    {textCol}
                    {iconCol}
                  </>
                )}
                {t.heart && (
                  <div className="flex justify-center">
                    <Image
                      src="/img/fornelover/coracao.png"
                      alt=""
                      width={552}
                      height={545}
                      className="animate-heart h-auto w-40 md:w-56"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom: pulsing heart + red wave */}
      <section className="relative bg-white pt-10">
        <Image
          src="/img/fornelover/coracao.png"
          alt=""
          width={552}
          height={545}
          className="animate-heart relative z-10 ml-6 h-auto w-32 md:w-44"
        />
        <Image
          src="/img/fornelover/bg-footer.png"
          alt=""
          width={2599}
          height={798}
          className="-mt-16 h-auto w-full md:-mt-24"
        />
      </section>
    </>
  );
}
