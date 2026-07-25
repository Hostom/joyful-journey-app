import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LOCATIONS, TYPES } from "@/data/properties";
import type { PropertyLocation, PropertyType, Property } from "@/data/properties";
import { propertiesQueryOptions } from "@/lib/properties.functions";
import { PropertyCard } from "@/components/fenomeno/PropertyCard";
import { SidebarFilter } from "@/components/fenomeno/SidebarFilter";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PropertyDetailModal } from "@/components/fenomeno/PropertyDetailModal";
import { Navbar } from "@/components/fenomeno/Navbar";
import { WhatsAppButton } from "@/components/fenomeno/WhatsAppButton";
import { BackToTop } from "@/components/fenomeno/BackToTop";
import { Footer } from "@/components/fenomeno/Footer";
import { X, SearchX, MessageSquare, SlidersHorizontal } from "lucide-react";

type Search = {
  location?: PropertyLocation;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  suites?: number;
  parking?: number;
  condominio?: string;
};

export const Route = createFileRoute("/imoveis/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(propertiesQueryOptions),
  validateSearch: (s: Record<string, unknown>): Search => {
    const loc = s.location as string | undefined;
    const typ = s.type as string | undefined;
    const min = Number(s.minPrice);
    const max = Number(s.maxPrice);
    const bed = Number(s.bedrooms);
    const sui = Number(s.suites);
    const pak = Number(s.parking);
    const cond = s.condominio as string | undefined;
    return {
      location: LOCATIONS.includes(loc as PropertyLocation) ? (loc as PropertyLocation) : undefined,
      type: TYPES.includes(typ as PropertyType) ? (typ as PropertyType) : undefined,
      minPrice: Number.isFinite(min) && min > 0 ? min : undefined,
      maxPrice: Number.isFinite(max) && max > 0 ? max : undefined,
      bedrooms: Number.isFinite(bed) && bed > 0 ? bed : undefined,
      suites: Number.isFinite(sui) && sui > 0 ? sui : undefined,
      parking: Number.isFinite(pak) && pak > 0 ? pak : undefined,
      condominio: typeof cond === "string" && cond.trim() !== "" ? cond.trim() : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Imóveis de Luxo em Balneário Camboriú | Fenômeno Imóveis" },
      {
        name: "description",
        content:
          "Explore o catálogo completo de imóveis de luxo em Balneário Camboriú, Itapema e Itajaí. Filtre por localização, tipo e faixa de preço.",
      },
      { property: "og:title", content: "Imóveis | Fenômeno Imóveis" },
      {
        property: "og:description",
        content: "Coberturas, penthouses e residências exclusivas no litoral catarinense.",
      },
    ],
  }),
  component: ListingsPage,
});

function ListingsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: PROPERTIES } = useSuspenseQuery(propertiesQueryOptions);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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
    if (search.condominio && !p.name.toLowerCase().includes(search.condominio.toLowerCase())) return false;
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
    !!search.parking ||
    !!search.condominio;

  const activeFilters: { label: string; key: keyof Search }[] = [];
  if (search.location) activeFilters.push({ label: search.location, key: "location" });
  if (search.type) activeFilters.push({ label: search.type, key: "type" });
  if (search.bedrooms) activeFilters.push({ label: `${search.bedrooms}+ quartos`, key: "bedrooms" });
  if (search.suites) activeFilters.push({ label: `${search.suites}+ suítes`, key: "suites" });
  if (search.parking) activeFilters.push({ label: `${search.parking}+ vagas`, key: "parking" });
  if (search.condominio) activeFilters.push({ label: `Condomínio: "${search.condominio}"`, key: "condominio" });

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
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gold-champagne/8 rounded-full blur-[140px] pointer-events-none -translate-x-1/2 z-0" />
      <div className="absolute top-2/3 right-0 w-[600px] h-[600px] bg-forest-mid/4 rounded-full blur-[160px] pointer-events-none translate-x-1/3 z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gold-champagne/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <Navbar />

      <div className="relative">
        <div
          className="absolute bottom-0 left-0 w-auto opacity-25 md:opacity-40 pointer-events-none z-0 select-none -translate-x-[20%]"
          style={{
            top: "max(40vh, 340px)",
          }}
        >
          <img src="/bg-logo-symbol.svg" alt="" className="w-auto h-full object-contain object-left-bottom" />
        </div>

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
            <p className="text-xs uppercase tracking-[0.4em] text-gold-champagne mb-4">Imóveis Disponíveis</p>
            <h1 className="font-display text-4xl md:text-6xl text-cream-foundation leading-[1.1] max-w-4xl">
              Imóveis de alto padrão em <em className="italic text-gold-champagne">Balneário Camboriú</em>
            </h1>
            <p className="mt-4 max-w-xl text-cream-foundation/75 text-sm md:text-base leading-relaxed">
              Explore nosso catálogo de residências e apartamentos de luxo em Balneário Camboriú, Itapema e Itajaí.
            </p>
          </div>
        </section>

        <section className="py-12 px-6 lg:px-12 max-w-[1600px] mx-auto z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start relative z-10">
            <aside className="hidden lg:block sticky top-[100px] h-[calc(100vh-140px)] max-h-[780px] glass3d bg-transparent border border-gold-champagne/30 rounded-lg flex flex-col overflow-hidden">
              <div className="overflow-y-auto p-6 h-full">
                <SidebarFilter
                  initialValues={search}
                  onSubmit={(values) => navigate({ search: values })}
                  onClear={clear}
                />
              </div>
            </aside>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-forest-deep/10">
                <span className="text-sm font-sans font-bold text-forest-deep">
                  {filtered.length} {filtered.length === 1 ? "imóvel" : "imóveis"}{" "}
                  <span className="font-normal text-forest-mid/60 font-sans">
                    encontrado{filtered.length !== 1 ? "s" : ""}
                  </span>
                </span>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs uppercase tracking-[0.15em] text-forest-deep hover:text-gold-classic font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Limpar Filtros
                  </button>
                )}
              </div>

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
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="py-24 text-center bg-white/60 backdrop-blur-sm border border-gold-champagne/20 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto w-full">
                  <SearchX className="w-12 h-12 text-gold-champagne mb-6 block mx-auto" />
                  <p className="font-display text-2xl mb-4 text-forest-deep">Nenhum imóvel encontrado.</p>
                  <p className="text-forest-mid/70 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                    Ajuste os seus filtros ou converse com nossos consultores para conhecer oportunidades exclusivas
                    off-market.
                  </p>
                  <button
                    type="button"
                    onClick={clear}
                    className="inline-flex items-center gap-2 border border-forest-deep/40 px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-forest-deep hover:text-cream-foundation transition-colors font-sans font-semibold cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-7 lg:gap-8">
                  {filtered.map((p, i) => (
                    <PropertyCard key={p.code} property={p} index={i} onSelect={setSelectedProperty} />
                  ))}
                </div>
              )}

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
                    Oportunidades Exclusivas
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl mb-4 leading-tight">
                    Lançamentos e Coberturas de Alto Padrão
                  </h3>
                  <p className="text-cream-foundation/75 text-sm max-w-xl leading-relaxed font-sans">
                    Invista no mercado imobiliário que mais valoriza no Brasil. Compre seu apartamento frente mar,
                    penthouse ou cobertura em Balneário Camboriú com assessoria jurídica e comercial completa. Fale com
                    a nossa equipe no WhatsApp.
                  </p>
                </div>
                <div className="relative z-10 shrink-0 w-full md:w-auto">
                  <a
                    href="https://api.whatsapp.com/send?phone=5547999837494"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gold-classic hover:bg-gold-champagne text-forest-deep px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-colors shadow-lg shadow-black/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 bg-forest-deep text-gold-classic border border-gold-classic px-5 py-3 rounded-full shadow-xl font-bold font-sans text-xs uppercase tracking-[0.15em] hover:bg-forest-mid transition-all active:scale-95 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtrar {hasFilters && `(${activeFilters.length})`}
          </button>
        </div>

        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
          <SheetContent
            side="left"
            className="w-[320px] glass3d bg-transparent border-none shadow-none border-r border-gold-champagne/30 p-0 flex flex-col overflow-hidden"
          >
            <div className="overflow-y-auto p-6 h-full">
              <SidebarFilter
                initialValues={search}
                onSubmit={(values) => {
                  navigate({ search: values });
                  setIsMobileFilterOpen(false);
                }}
                onClear={() => {
                  clear();
                  setIsMobileFilterOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      </div>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
