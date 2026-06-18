import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";

export const metadata: Metadata = {
  title: "Termo de Adequação à LGPD — Forneria Original",
};

export default function PoliticaLgpdPage() {
  return (
    <>
      <HeroBanner title="Termo de Adequação à LGPD" />

      <article className="container-fc max-w-3xl space-y-4 py-12 text-forneria-black/80 [&_p]:leading-relaxed">
        <p>
          O presente Termo de Adequação LGPD tem como objeto garantir a adequação da
          Empresa Forneria Original Franquias LTDA à Lei Geral de Proteção de Dados
          (Lei 13.709/2018).
        </p>
        <p>
          A Forneria Original Franquias LTDA (Empresa), na qualidade de Controlador(a)
          que corresponde a pessoa jurídica de direito público/privado, a quem compete
          as decisões referentes ao tratamento de dados pessoais, afirma que adota
          todas as medidas necessárias para assegurar a observância à Lei Geral de
          Proteção de Dados.
        </p>
        <p>
          A Forneria Original Franquias LTDA, atua no ramo de atividade de Alimentícia,
          ocasião em que dados sensíveis/pessoais são coletados, sendo seu objetivo o
          melhor relacionamento com os seus clientes e parceiros e sempre com respeito
          à privacidade dos dados recepcionados.
        </p>
        <p>
          A Empresa se compromete a manter a confidencialidade e a integridade de todos
          os dados pessoais mantidos ou consultados/transmitidos eletronicamente, para
          garantir a proteção desses dados contra acesso não autorizado, destruição,
          uso, modificação, divulgação ou perda acidental ou indevida. Para fins de
          clareza, os dados pessoais correspondem as informações relacionadas as
          pessoas naturais identificadas ou identificáveis.
        </p>
        <p>
          A Empresa se compromete a tratar os dados pessoais a que tiver acesso somente
          com as respectivas permissões dos titulares desses dados, ou seja, mediante
          as confirmações das pessoas naturais as quais se referem os dados pessoais
          que serão objeto de tratamento.
        </p>
        <p>
          A Empresa assegura que todos os seus colaboradores prepostos, sócios,
          diretores, representantes ou terceiros contratados que tenham acesso aos dados
          pessoais que estão sob a responsabilidade da Empresa, assinaram o Termo de
          Confidencialidade, bem como comprometem-se a manter quaisquer Dados Pessoais
          estritamente confidenciais e não os utilizar para outros fins, com exceção a
          prestação de serviços.
        </p>
        <p>
          Os Dados Pessoais não poderão ser revelados a terceiros, com exceção da prévia
          autorização por escrito do titular dos dados pessoais, ou ainda na hipótese da
          Empresa, por determinação legal, ter que fornecer os dados pessoais a uma
          autoridade pública, ocasião em que o titular dos dados pessoais deverá ser
          informado previamente para que tome as medidas necessárias.
        </p>
      </article>
    </>
  );
}
