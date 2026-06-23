import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PROPERTIES, LOCATIONS, TYPES } from "@/data/properties";
import type { PropertyLocation, PropertyType } from "@/data/properties";
import { PropertyCard } from "@/components/fenomeno/PropertyCard";

type Search = {
  location?: PropertyLocation;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
};

export const Route = createFileRoute("/imoveis/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const loc = s.location as string | undefined;
    const typ = s.type as string | undefined;
    const min = Number(s.minPrice);
    const max = Number(s.maxPrice);
    return {
      location: LOCATIONS.includes(loc as PropertyLocation)
        ? (loc as PropertyLocation)
        : undefined,
      type: TYPES.includes(typ as PropertyType)
        ? (typ as PropertyType)
        : undefined,
      minPrice: Number.isFinite(min) && min > 0 ? min : undefined,
      maxPrice: Number.isFinite(max) && max > 0 ? max : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Portfólio de Imóveis | Fenômeno Imóveis" },
      {
        name: "description",
        content:
          "Explore o portfólio completo de imóveis de luxo em Balneário Camboriú, Itapema e Itajaí. Filtre por localização, tipo e faixa de preço.",
      },
      { property: "og:title", content: "Portfólio | Fenômeno Imóveis" },
      {
        property: "og:description",
        content:
          "Coberturas, penthouses e residências exclusivas no litoral catarinense.",
      },
    ],
  }),
  component: ListingsPage,
});

const PRICE_OPTIONS = [
  { label: "Sem mínimo", value: 0 },
  { label: "R$ 5M", value: 5_000_000 },
  { label: "R$ 10M", value: 10_000_000 },
  { label: "R$ 20M", value: 20_000_000 },
  { label: "R$ 30M", value: 30_000_000 },
];

const MAX_OPTIONS = [
  { label: "Sem máximo", value: 0 },
  { label: "R$ 10M", value: 10_000_000 },
  { label: "R$ 20M", value: 20_000_000 },
  { label: "R$ 40M", value: 40_000_000 },
  { label: "R$ 100M", value: 100_000_000 },
];

function ListingsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("active");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".reveal-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });

  const filtered = PROPERTIES.filter((p) => {
    if (search.location && p.location !== search.location) return false;
    if (search.type && p.type !== search.type) return false;
    if (search.minPrice && p.price > 0 && p.price < search.minPrice) return false;
    if (search.maxPrice && p.price > 0 && p.price > search.maxPrice) return false;
    return true;
  });

  const setFilter = (patch: Partial<Search>) => {
    navigate({
      search: (prev) => {
        const next = { ...prev, ...patch };
        (Object.keys(next) as (keyof Search)[]).forEach((k) => {
          if (next[k] === undefined || next[k] === ("" as never)) delete next[k];
        });
        return next;
      },
    });
  };

  const clear = () => navigate({ search: {} });
  const hasFilters =
    !!search.location || !!search.type || !!search.minPrice || !!search.maxPrice;

  return (
    <div className="bg-cream-foundation text-forest-deep min-h-screen">
      <ListingsNav />

      <section className="pt-40 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-classic mb-6">
          Portfólio Completo
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] max-w-4xl">
          Imóveis que <em className="italic text-gold-classic">definem</em> o
          litoral.
        </h1>
        <p className="mt-6 max-w-xl text-forest-mid/80 leading-relaxed">
          Explore nossa seleção curada de residências exclusivas. Use os
          filtros abaixo para encontrar o endereço ideal.
        </p>
      </section>

      <section className="sticky top-[72px] z-30 bg-cream-foundation/95 backdrop-blur border-y border-forest-deep/10 py-5 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-end gap-4">
          <Filter
            label="Localização"
            value={search.location ?? ""}
            onChange={(v) =>
              setFilter({ location: (v || undefined) as PropertyLocation })
            }
            options={[
              { label: "Todas", value: "" },
              ...LOCATIONS.map((l) => ({ label: l, value: l })),
            ]}
          />
          <Filter
            label="Tipo"
            value={search.type ?? ""}
            onChange={(v) =>
              setFilter({ type: (v || undefined) as PropertyType })
            }
            options={[
              { label: "Todos", value: "" },
              ...TYPES.map((t) => ({ label: t, value: t })),
            ]}
          />
          <Filter
            label="Preço mín."
            value={String(search.minPrice ?? 0)}
            onChange={(v) =>
              setFilter({ minPrice: Number(v) || undefined })
            }
            options={PRICE_OPTIONS.map((o) => ({
              label: o.label,
              value: String(o.value),
            }))}
          />
          <Filter
            label="Preço máx."
            value={String(search.maxPrice ?? 0)}
            onChange={(v) =>
              setFilter({ maxPrice: Number(v) || undefined })
            }
            options={MAX_OPTIONS.map((o) => ({
              label: o.label,
              value: String(o.value),
            }))}
          />
          <div className="ml-auto flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.2em] text-forest-mid/60">
              {filtered.length} {filtered.length === 1 ? "imóvel" : "imóveis"}
            </span>
            {hasFilters && (
              <button
                type="button"
                onClick={clear}
                className="text-xs uppercase tracking-[0.2em] text-forest-deep hover:text-gold-classic"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-3xl mb-4">
              Nenhum imóvel encontrado.
            </p>
            <p className="text-forest-mid/70 mb-8">
              Ajuste os filtros ou converse com nosso concierge para
              oportunidades off-market.
            </p>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 border border-forest-deep/40 px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-forest-deep hover:text-cream-foundation transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((p, i) => (
              <PropertyCard key={p.slug} property={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.25em] text-forest-mid/60">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border border-forest-deep/20 px-4 py-2 text-sm focus:outline-none focus:border-gold-classic min-w-[160px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ListingsNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-forest-deep py-4 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-wide text-cream-foundation">
            Fenômeno
          </span>
          <span className="font-display italic text-sm text-gold-champagne">
            imóveis
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.2em] text-cream-foundation/80 hover:text-gold-champagne"
          >
            Início
          </Link>
          <Link
            to="/imoveis"
            className="text-xs uppercase tracking-[0.2em] text-gold-champagne"
          >
            Portfólio
          </Link>
          <Link
            to="/"
            hash="contact"
            className="text-xs uppercase tracking-[0.2em] text-cream-foundation/80 hover:text-gold-champagne"
          >
            Contato
          </Link>
        </nav>
        <Link
          to="/"
          hash="contact"
          className="hidden md:inline-flex items-center gap-2 border border-gold-champagne/60 text-gold-champagne px-5 py-2 text-xs uppercase tracking-[0.2em] hover:bg-gold-champagne hover:text-forest-deep transition-all"
        >
          Atendimento Privado
        </Link>
      </div>
    </header>
  );
}
