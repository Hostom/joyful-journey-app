import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PROPERTIES, LOCATIONS, TYPES } from "@/data/properties";
import type { PropertyLocation, PropertyType } from "@/data/properties";
import { PropertyCard } from "@/components/fenomeno/PropertyCard";
import { AdvancedFilter } from "@/components/fenomeno/AdvancedFilter";
import { Navbar } from "@/components/fenomeno/Navbar";
import { WhatsAppButton } from "@/components/fenomeno/WhatsAppButton";
import { BackToTop } from "@/components/fenomeno/BackToTop";
import { Footer } from "@/components/fenomeno/Footer";

type Search = {
  location?: PropertyLocation;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  suites?: number;
  parking?: number;
};

export const Route = createFileRoute("/imoveis/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const loc = s.location as string | undefined;
    const typ = s.type as string | undefined;
    const min = Number(s.minPrice);
    const max = Number(s.maxPrice);
    const bed = Number(s.bedrooms);
    const sui = Number(s.suites);
    const pak = Number(s.parking);
    return {
      location: LOCATIONS.includes(loc as PropertyLocation)
        ? (loc as PropertyLocation)
        : undefined,
      type: TYPES.includes(typ as PropertyType)
        ? (typ as PropertyType)
        : undefined,
      minPrice: Number.isFinite(min) && min > 0 ? min : undefined,
      maxPrice: Number.isFinite(max) && max > 0 ? max : undefined,
      bedrooms: Number.isFinite(bed) && bed > 0 ? bed : undefined,
      suites: Number.isFinite(sui) && sui > 0 ? sui : undefined,
      parking: Number.isFinite(pak) && pak > 0 ? pak : undefined,
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

function ListingsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [showFilters, setShowFilters] = useState(false);

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
    if (search.bedrooms && p.bedrooms < search.bedrooms) return false;
    if (search.suites && p.suites < search.suites) return false;
    if (search.parking && p.parking < search.parking) return false;
    return true;
  });

  const clear = () => navigate({ search: {} });
  const hasFilters =
    !!search.location ||
    !!search.type ||
    !!search.minPrice ||
    !!search.maxPrice ||
    !!search.bedrooms ||
    !!search.suites ||
    !!search.parking;

  // Active filter tags for display
  const activeFilters: { label: string; key: keyof Search }[] = [];
  if (search.location) activeFilters.push({ label: search.location, key: "location" });
  if (search.type) activeFilters.push({ label: search.type, key: "type" });
  if (search.bedrooms) activeFilters.push({ label: `${search.bedrooms}+ quartos`, key: "bedrooms" });
  if (search.suites) activeFilters.push({ label: `${search.suites}+ suítes`, key: "suites" });
  if (search.parking) activeFilters.push({ label: `${search.parking}+ vagas`, key: "parking" });

  const removeFilter = (key: keyof Search) => {
    navigate({
      search: (prev: Search) => {
        const next = { ...prev };
        delete next[key];
        return next;
      },
    });
  };

  return (
    <div className="bg-cream-foundation text-forest-deep min-h-screen relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gold-champagne/8 rounded-full blur-[140px] pointer-events-none -translate-x-1/2 z-0" />
      <div className="absolute top-2/3 right-0 w-[600px] h-[600px] bg-forest-mid/4 rounded-full blur-[160px] pointer-events-none translate-x-1/3 z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gold-champagne/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <Navbar />

      {/* Parallax Header Banner */}
      <section className="relative h-[40vh] min-h-[340px] overflow-hidden flex flex-col justify-end pb-10 pt-28">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Portfólio de Luxo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/80 via-forest-deep/50 to-forest-deep" />
        </div>
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-6 lg:px-12">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-champagne mb-4">
            Portfólio Completo
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-cream-foundation leading-[1.1] max-w-4xl">
            Imóveis que <em className="italic text-gold-champagne">definem</em> o litoral
          </h1>
          <p className="mt-4 max-w-xl text-cream-foundation/75 text-sm md:text-base leading-relaxed">
            Explore nossa seleção curada de residências exclusivas em Balneário Camboriú, Itapema e Itajaí.
          </p>
        </div>
      </section>

      {/* Toolbar: Filters toggle + result count + active tags */}
      <section className="sticky top-0 z-30 bg-cream-foundation/90 backdrop-blur-lg border-b border-forest-deep/8">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 bg-forest-deep text-cream-foundation px-5 py-2.5 rounded-lg text-xs uppercase tracking-[0.15em] font-bold font-sans hover:bg-forest-mid transition-colors cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                {showFilters ? "Ocultar Filtros" : "Filtros"}
              </button>
              <span className="text-sm font-sans font-bold text-forest-deep">
                {filtered.length} {filtered.length === 1 ? "imóvel" : "imóveis"}{" "}
                <span className="font-normal text-forest-mid/60">encontrado{filtered.length !== 1 ? "s" : ""}</span>
              </span>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clear}
                className="text-xs uppercase tracking-[0.15em] text-forest-deep hover:text-gold-classic font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Limpar Filtros
              </button>
            )}
          </div>

          {/* Active filter tags */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => removeFilter(f.key)}
                  className="inline-flex items-center gap-1.5 bg-forest-deep/8 text-forest-deep px-3 py-1.5 rounded-full text-[11px] font-sans font-semibold hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                >
                  {f.label}
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collapsible Filters Panel */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out bg-forest-deep/95 backdrop-blur-xl border-b border-gold-champagne/20 ${
          showFilters ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-6">
          <AdvancedFilter
            variant="listings"
            initialValues={search}
            onSubmit={(values) => {
              navigate({ search: values });
              setShowFilters(false);
            }}
          />
        </div>
      </div>

      {/* Main listings grid — full width, 3 columns */}
      <section className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto z-10 relative">
        {/* Listings Grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center bg-white/60 backdrop-blur-sm border border-gold-champagne/20 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-gold-champagne text-5xl mb-6 block">search_off</span>
            <p className="font-display text-2xl mb-4 text-forest-deep">
              Nenhum imóvel encontrado.
            </p>
            <p className="text-forest-mid/70 text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Ajuste os seus filtros ou converse com nosso concierge para conhecer oportunidades exclusivas off-market.
            </p>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 border border-forest-deep/40 px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-forest-deep hover:text-cream-foundation transition-colors font-sans font-semibold"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-7 lg:gap-8">
            {filtered.map((p, i) => (
              <PropertyCard key={p.slug} property={p} index={i} />
            ))}
          </div>
        )}

        {/* Concierge Off-Market Card */}
        <div className="mt-16 bg-forest-deep text-cream-foundation rounded-2xl p-8 md:p-12 relative overflow-hidden border border-gold-champagne/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&w=1200&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 flex-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-champagne mb-3">
              Coleção Privada
            </p>
            <h3 className="font-display text-2xl md:text-3xl mb-4 leading-tight">
              Procura discrição absoluta ou algo ainda mais exclusivo?
            </h3>
            <p className="text-cream-foundation/75 text-sm max-w-xl leading-relaxed font-sans">
              Nossa equipe administra residências secretas, penthouses e coberturas no regime off-market. Converse com o nosso concierge.
            </p>
          </div>
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/5547999999999"
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gold-classic hover:bg-gold-champagne text-forest-deep px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-colors shadow-lg shadow-black/20"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}


/* ListingsNav removed — using shared <Navbar /> */
