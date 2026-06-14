"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import CityDropdown from "./CityDropdown";
import { navItems } from "@/lib/data";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="flex w-full items-center gap-4 px-4 py-2 sm:px-6 lg:px-10">
        {/* Round logo badge: a white circle that overflows below the header and
            overlaps the banner content. Pushed down so its top is not clipped. */}
        <div className="relative shrink-0 translate-y-[26px]">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[138px] w-[138px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_12px_16px_-10px_rgba(0,0,0,0.3)]"
          />
          <Logo className="relative z-10" />
        </div>

        {/* Centered nav (desktop) */}
        <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const className = `nav-link whitespace-nowrap ${active ? "text-forneria-red" : ""}`;
            return item.external ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* City + phone on the right (desktop) */}
        <div className="hidden shrink-0 lg:block">
          <CityDropdown />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-forneria-black lg:hidden"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <nav className="container-fc flex flex-col gap-1 py-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const className = `rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-forneria-gray ${
                active ? "text-forneria-red" : "text-forneria-black/80"
              }`;
              return item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className={className}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={className}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 border-t border-gray-100 pt-4">
              <CityDropdown />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
