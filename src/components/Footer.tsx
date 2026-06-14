import Link from "next/link";
import Logo from "./Logo";
import { SocialIconByName } from "./SocialIcons";
import {
  cities,
  footerDepartments,
  footerPolicies,
  socialLinks,
} from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Split department links into two columns, as on the original site.
  const half = Math.ceil(footerDepartments.length / 2);
  const deptCol1 = footerDepartments.slice(0, half);
  const deptCol2 = footerDepartments.slice(half);

  return (
    <footer className="bg-forneria-black text-gray-300">
      <div className="container-fc grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Logo + description */}
        <div>
          <Logo variant="white" />
          <p className="mt-5 text-sm leading-relaxed text-gray-400">
            A Forneria Original oferece uma experiência única em pizzas desde
            2016, conquistando clientes com receitas inovadoras, sabores
            exclusivos e MUITO recheio. Atualmente, a rede conta com mais de 54
            unidades em todo o Brasil e expandiu sua oferta para incluir marcas
            próprias de massas, açaí, hambúrgueres, poke e sobremesas.{" "}
            <Link href="/a-forneria-original" className="text-forneria-red hover:underline">
              Leia mais…
            </Link>
          </p>
        </div>

        {/* Departamento */}
        <div>
          <h4 className="mb-4 text-lg font-bold text-white">Departamento</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <ul className="space-y-2">
              {deptCol1.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 transition hover:text-[#f66d6d]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-sm text-gray-400 transition hover:text-[#f66d6d]">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {deptCol2.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 transition hover:text-[#f66d6d]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-sm text-gray-400 transition hover:text-[#f66d6d]">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nossas Políticas */}
        <div>
          <h4 className="mb-4 text-lg font-bold text-white">Nossas Políticas</h4>
          <ul className="space-y-2">
            {footerPolicies.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-gray-400 transition hover:text-[#f66d6d]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="mb-4 text-lg font-bold text-white">Contato</h4>
          <ul className="space-y-2">
            {cities.map((city) => (
              <li key={city.name} className="flex items-start gap-2 text-sm text-gray-400">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-forneria-red-bright" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z" />
                </svg>
                <span>
                  <strong className="text-gray-200">{city.name}:</strong> {city.phone}
                </span>
              </li>
            ))}
          </ul>

          <h4 className="mb-3 mt-6 text-base font-bold text-white">Nossas Redes</h4>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-white transition hover:text-[#f66d6d]"
              >
                <SocialIconByName name={social.icon} className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fc pb-6 text-center text-xs text-gray-500">
        CNPJ: 34.104.005/0001-86
      </div>

      {/* Bottom red bar */}
      <div className="bg-grad-top py-4 text-center text-sm text-white">
        <p>
          Copyright © {currentYear} <strong>FORNERIA ORIGINAL</strong> Todos os
          direitos reservados
        </p>
        <p className="mt-1 text-xs">
          Desenvolvido por:{" "}
          <a
            href="https://onchannel.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            On Channel
          </a>
        </p>
      </div>
    </footer>
  );
}
