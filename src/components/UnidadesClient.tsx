"use client";

import { useState } from "react";
import UnitCard from "./UnitCard";
import { unitStates, type Unit } from "@/lib/data";

const ALL = "Todas as Unidades";

export default function UnidadesClient({ units }: { units: Unit[] }) {
  const [active, setActive] = useState<string>(ALL);

  // Group units by state, respecting the tab order, so the "Todas" view shows
  // sectioned headings exactly like the original page.
  const statesToShow =
    active === ALL ? unitStates : unitStates.filter((s) => s === active);

  return (
    <div className="container-fc py-10">
      {/* Tabs */}
      <div className="mb-8 flex flex-wrap overflow-hidden rounded-md border border-forneria-red">
        {[ALL, ...unitStates].map((state) => {
          const isActive = active === state;
          return (
            <button
              key={state}
              type="button"
              onClick={() => setActive(state)}
              className={`flex-1 whitespace-nowrap px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-forneria-red-dark text-white"
                  : "bg-forneria-red text-white/90 hover:bg-forneria-red-dark"
              }`}
            >
              {state}
            </button>
          );
        })}
      </div>

      {statesToShow.map((state) => {
        const stateUnits = units.filter((u) => u.state === state);
        if (stateUnits.length === 0) return null;
        return (
          <div key={state} className="mb-12">
            <h2 className="mb-6 text-2xl font-extrabold text-forneria-black">
              {state}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stateUnits.map((unit) => (
                <UnitCard key={unit.name} unit={unit} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
