import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";

export const metadata: Metadata = {
  title: "Política de Cookies — Forneria Original",
};

export default function PoliticaCookiePage() {
  return (
    <>
      <HeroBanner title="Política de Cookies" />

      <article className="container-fc max-w-3xl space-y-4 py-12 text-forneria-black/80 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-forneria-red [&_p]:leading-relaxed">
        <p>
          Esta Política de Cookies descreve como usamos cookies e tecnologias
          similares em nosso site para melhorar sua experiência de usuário.
        </p>

        <h2>O que são Cookies?</h2>
        <p>
          Cookies são pequenos arquivos de texto que são armazenados em seu
          dispositivo quando você visita um site. Eles são amplamente utilizados
          para tornar os sites mais eficientes e fornecer informações aos
          proprietários do site.
        </p>

        <h2>Como Utilizamos os Cookies</h2>
        <p>Utilizamos cookies para:</p>
        <ul className="list-disc space-y-2 pl-6 leading-relaxed">
          <li>
            <strong>Análise e Desempenho:</strong> Ajudam a entender como os
            visitantes interagem com nosso site, fornecendo informações sobre áreas
            visitadas, tempo gasto no site, e erros encontrados, permitindo melhorias
            em sua performance.
          </li>
          <li>
            <strong>Funcionalidade:</strong> Permitem lembrar suas preferências, como
            idioma ou região, para fornecer uma experiência mais personalizada.
          </li>
          <li>
            <strong>Publicidade:</strong> Podem ser utilizados para exibir anúncios
            mais relevantes de acordo com seus interesses.
          </li>
        </ul>

        <h2>Tipos de Cookies que Usamos</h2>
        <ul className="list-disc space-y-2 pl-6 leading-relaxed">
          <li>
            <strong>Cookies Essenciais:</strong> São necessários para o funcionamento
            básico do site e permitem que você navegue e use suas funcionalidades.
          </li>
          <li>
            <strong>Cookies de Desempenho:</strong> Coletam informações sobre como
            você utiliza o site, como páginas visitadas e erros encontrados, para
            melhorar o funcionamento do site.
          </li>
          <li>
            <strong>Cookies de Funcionalidade:</strong> Permitem lembrar suas escolhas
            e personalizar sua experiência no site.
          </li>
          <li>
            <strong>Cookies de Publicidade:</strong> São utilizados para fornecer
            anúncios mais relevantes para você.
          </li>
        </ul>

        <h2>Gerenciando Cookies</h2>
        <p>
          Você pode controlar e/ou deletar cookies conforme desejar. Você pode apagar
          todos os cookies já armazenados em seu computador e configurar a maioria dos
          navegadores para prevenir o armazenamento de cookies. No entanto, isso pode
          impactar na sua experiência de navegação, limitando a funcionalidade de
          certas partes do site.
        </p>

        <h2>Atualizações na Política de Cookies</h2>
        <p>
          Esta Política de Cookies pode ser atualizada periodicamente para refletir
          alterações em nossas práticas de cookies. Recomendamos que você revise esta
          página regularmente para estar ciente de quaisquer mudanças.
        </p>
        <p>
          Ao utilizar nosso site, você concorda com o uso de cookies de acordo com esta
          Política de Cookies. Se não concordar com o uso de cookies, por favor, ajuste
          suas configurações ou evite utilizar nosso site.
        </p>
        <p>
          Para quaisquer questões sobre nossa Política de Privacidade, entre em contato
          conosco{" "}
          <a href="mailto:sac@forneriaoriginal.com" className="text-forneria-red hover:underline">
            sac@forneriaoriginal.com
          </a>
          .
        </p>
        <p className="text-sm text-forneria-black/50">Última atualização: 19/08/2024.</p>
      </article>
    </>
  );
}
