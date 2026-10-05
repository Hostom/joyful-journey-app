import { useId, useState, useEffect, useRef } from "react";
import type { PropertyLocation, PropertyType } from "@/data/properties";
import { LOCATIONS, TYPES } from "@/data/properties";

type FilterValues = {
  location?: PropertyLocation;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  suites?: number;
  parking?: number;
  condominio?: string;
};

type AdvancedFilterProps = {
  initialValues?: FilterValues;
  onSubmit: (values: FilterValues) => void;
  variant?: "hero" | "listings";
  defaultExpanded?: boolean;
  showCollapse?: boolean;
  bgClassName?: string;
};

export function AdvancedFilter({
  initialValues,
  onSubmit,
  variant = "hero",
  defaultExpanded,
  showCollapse = true,
  bgClassName,
}: AdvancedFilterProps) {
  const [location, setLocation] = useState<string>(initialValues?.location ?? "");
  const [type, setType] = useState<string>(initialValues?.type ?? "");
  const [status, setStatus] = useState<string>("");
  const [condominio, setCondominio] = useState<string>(initialValues?.condominio ?? "");
  
  const [bedrooms, setBedrooms] = useState<number | undefined>(initialValues?.bedrooms);
  const [suites, setSuites] = useState<number | undefined>(initialValues?.suites);
  const [parking, setParking] = useState<number | undefined>(initialValues?.parking);
  
  const [minPrice, setMinPrice] = useState<number>(initialValues?.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState<number>(initialValues?.maxPrice ?? 50000000);

  const [isExpanded, setIsExpanded] = useState<boolean>(
    defaultExpanded ?? (variant === "listings")
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  // Sync state if initialValues change
  useEffect(() => {
    if (initialValues) {
      setLocation(initialValues.location ?? "");
      setType(initialValues.type ?? "");
      setBedrooms(initialValues.bedrooms);
      setSuites(initialValues.suites);
      setParking(initialValues.parking);
      setMinPrice(initialValues.minPrice ?? 0);
      setMaxPrice(initialValues.maxPrice ?? 50000000);
      setCondominio(initialValues.condominio ?? "");
    }
  }, [initialValues]);

  // Click outside listener
  useEffect(() => {
    if (!isExpanded || variant !== "hero" || !showCollapse) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, variant, showCollapse]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      location: (location || undefined) as PropertyLocation | undefined,
      type: (type || undefined) as PropertyType | undefined,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < 50000000 ? maxPrice : undefined,
      bedrooms: bedrooms || undefined,
      suites: suites || undefined,
      parking: parking || undefined,
      condominio: condominio || undefined,
    });
  };

  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  };

  const handleMinPriceChange = (valStr: string) => {
    const num = Number(valStr.replace(/\D/g, ""));
    setMinPrice(num);
  };

  const handleMaxPriceChange = (valStr: string) => {
    const num = Number(valStr.replace(/\D/g, ""));
    setMaxPrice(num);
  };

  const isHero = variant === "hero";

  // Listings Page Variant (Horizontal panel inside collapsible drawer)
  if (!isHero) {
    return (
      <form
        onSubmit={handleSearchSubmit}
        className="w-full text-cream-foundation"
      >
        {/* Row 1: Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
          {/* Condomínio */}
          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor={`${uid}-condominio`} className="text-[10px] uppercase tracking-[0.2em] text-gold-champagne font-semibold font-sans">
              Condomínio
            </label>
            <div className="bg-white rounded-lg px-3.5 py-2 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep focus-within:border-gold-classic focus-within:ring-1 focus-within:ring-gold-classic h-[42px]">
              <span className="material-symbols-outlined text-gold-classic mr-2 text-lg" aria-hidden="true">search</span>
              <input
                id={`${uid}-condominio`}
                type="text"
                value={condominio}
                onChange={(e) => setCondominio(e.target.value)}
                placeholder="Condomínio"
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-sans font-medium text-forest-deep placeholder:text-forest-mid/40"
              />
            </div>
          </div>

          {/* Localização */}
          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor={`${uid}-location`} className="text-[10px] uppercase tracking-[0.2em] text-gold-champagne font-semibold font-sans">
              Localização
            </label>
            <div className="bg-white rounded-lg px-3.5 py-2.5 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep focus-within:border-gold-classic focus-within:ring-1 focus-within:ring-gold-classic">
              <span className="material-symbols-outlined text-gold-classic mr-2 text-lg" aria-hidden="true">location_on</span>
              <select
                id={`${uid}-location`}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-sans font-medium text-forest-deep cursor-pointer appearance-none"
              >
                <option value="" className="text-forest-deep">Todas as localizações</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l} className="text-forest-deep">
                    {l}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-forest-mid/60 absolute right-3 pointer-events-none text-lg" aria-hidden="true">expand_more</span>
            </div>
          </div>

          {/* Tipo do Imóvel */}
          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor={`${uid}-type`} className="text-[10px] uppercase tracking-[0.2em] text-gold-champagne font-semibold font-sans">
              Tipo
            </label>
            <div className="bg-white rounded-lg px-3.5 py-2.5 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep focus-within:border-gold-classic focus-within:ring-1 focus-within:ring-gold-classic">
              <span className="material-symbols-outlined text-gold-classic mr-2 text-lg" aria-hidden="true">home</span>
              <select
                id={`${uid}-type`}
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-sans font-medium text-forest-deep cursor-pointer appearance-none"
              >
                <option value="" className="text-forest-deep">Todos os tipos</option>
                {TYPES.map((t) => (
                  <option key={t} value={t} className="text-forest-deep">
                    {t}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-forest-mid/60 absolute right-3 pointer-events-none text-lg" aria-hidden="true">expand_more</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor={`${uid}-status`} className="text-[10px] uppercase tracking-[0.2em] text-gold-champagne font-semibold font-sans">
              Status
            </label>
            <div className="bg-white rounded-lg px-3.5 py-2.5 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep focus-within:border-gold-classic focus-within:ring-1 focus-within:ring-gold-classic">
              <span className="material-symbols-outlined text-gold-classic mr-2 text-lg" aria-hidden="true">info</span>
              <select
                id={`${uid}-status`}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-sans font-medium text-forest-deep cursor-pointer appearance-none"
              >
                <option value="" className="text-forest-deep">Todos os status</option>
                <option value="pronto" className="text-forest-deep">Pronto para morar</option>
                <option value="construcao" className="text-forest-deep">Em construção</option>
                <option value="lancamento" className="text-forest-deep">Lançamento</option>
              </select>
              <span className="material-symbols-outlined text-forest-mid/60 absolute right-3 pointer-events-none text-lg" aria-hidden="true">expand_more</span>
            </div>
          </div>

          {/* Quartos */}
          <div className="flex flex-col gap-1.5">
            <span id={`${uid}-bedrooms-label`} className="text-[10px] uppercase tracking-[0.2em] text-gold-champagne font-semibold font-sans">
              Quartos
            </span>
            <div role="group" aria-labelledby={`${uid}-bedrooms-label`} className="bg-white rounded-lg p-1.5 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep h-[42px]">
              <span className="material-symbols-outlined text-forest-mid/60 mr-2 ml-1 text-lg" aria-hidden="true">bed</span>
              <div className="flex justify-between items-center w-full pr-1">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    aria-pressed={bedrooms === num}
                    aria-label={`${num} ${num === 1 ? "quarto" : "quartos"}`}
                    onClick={() => setBedrooms(bedrooms === num ? undefined : num)}
                    className={`w-6 h-6 rounded-md text-[11px] font-bold font-sans transition-all flex items-center justify-center cursor-pointer ${
                      bedrooms === num
                        ? "bg-gold-classic text-forest-deep"
                        : "text-forest-deep hover:bg-cream-stone/40"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Suítes, Vagas, Preço, Submit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Suítes */}
          <div className="flex flex-col gap-1.5">
            <span id={`${uid}-suites-label`} className="text-[10px] uppercase tracking-[0.2em] text-gold-champagne font-semibold font-sans">
              Suítes
            </span>
            <div role="group" aria-labelledby={`${uid}-suites-label`} className="bg-white rounded-lg p-1.5 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep h-[42px]">
              <span className="material-symbols-outlined text-forest-mid/60 mr-2 ml-1 text-lg" aria-hidden="true">king_bed</span>
              <div className="flex justify-between items-center w-full pr-1">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    aria-pressed={suites === num}
                    aria-label={`${num} ${num === 1 ? "suíte" : "suítes"}`}
                    onClick={() => setSuites(suites === num ? undefined : num)}
                    className={`w-6 h-6 rounded-md text-[11px] font-bold font-sans transition-all flex items-center justify-center cursor-pointer ${
                      suites === num
                        ? "bg-gold-classic text-forest-deep"
                        : "text-forest-deep hover:bg-cream-stone/40"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vagas */}
          <div className="flex flex-col gap-1.5">
            <span id={`${uid}-parking-label`} className="text-[10px] uppercase tracking-[0.2em] text-gold-champagne font-semibold font-sans">
              Vagas
            </span>
            <div role="group" aria-labelledby={`${uid}-parking-label`} className="bg-white rounded-lg p-1.5 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep h-[42px]">
              <span className="material-symbols-outlined text-forest-mid/60 mr-2 ml-1 text-lg" aria-hidden="true">directions_car</span>
              <div className="flex justify-between items-center w-full pr-1">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    aria-pressed={parking === num}
                    aria-label={`${num} ${num === 1 ? "vaga" : "vagas"}`}
                    onClick={() => setParking(parking === num ? undefined : num)}
                    className={`w-6 h-6 rounded-md text-[11px] font-bold font-sans transition-all flex items-center justify-center cursor-pointer ${
                      parking === num
                        ? "bg-gold-classic text-forest-deep"
                        : "text-forest-deep hover:bg-cream-stone/40"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-1.5">
            <span id={`${uid}-price-label`} className="text-[10px] uppercase tracking-[0.2em] text-gold-champagne font-semibold font-sans">
              Valor
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label className="sr-only" htmlFor={`${uid}-min-price`}>Valor mínimo</label>
              <input
                id={`${uid}-min-price`}
                type="text"
                value={minPrice === 0 ? "R$ 0" : formatBRL(minPrice)}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                className="w-full bg-forest-deep border border-gold-champagne/30 rounded-lg p-2 text-[11px] text-cream-foundation font-sans font-medium focus:outline-none focus:border-gold-classic h-[42px]"
                placeholder="Mínimo"
              />
              <label className="sr-only" htmlFor={`${uid}-max-price`}>Valor máximo</label>
              <input
                id={`${uid}-max-price`}
                type="text"
                value={maxPrice === 50000000 ? "R$ 50M+" : formatBRL(maxPrice)}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="w-full bg-forest-deep border border-gold-champagne/30 rounded-lg p-2 text-[11px] text-cream-foundation font-sans font-medium focus:outline-none focus:border-gold-classic h-[42px]"
                placeholder="Máximo"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gold-classic hover:bg-gold-champagne text-forest-deep transition-all duration-300 font-bold px-4 py-3 rounded-lg text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 h-[42px]"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            Aplicar Filtros
          </button>
        </div>
      </form>
    );
  }

  // Hero Collapsible variant (Morphing single card layout)
  return (
    <div
      ref={containerRef}
      className={`mx-auto border text-cream-foundation transition-all duration-500 ease-in-out shadow-2xl overflow-hidden ${
        bgClassName || "bg-forest-deep/50 backdrop-blur-md"
      } ${
        isExpanded
          ? "w-full max-w-5xl rounded-3xl p-6 lg:p-8 border-gold-classic/60"
          : "w-full max-w-2xl rounded-full p-4 cursor-pointer border-gold-champagne/40 hover:border-gold-classic hover:bg-forest-deep/60 transform hover:scale-[1.01]"
      }`}
      onClick={!isExpanded ? () => setIsExpanded(true) : undefined}
    >
      {/* Collapsed content container */}
      <div
        className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
          isExpanded
            ? "opacity-0 max-h-0 overflow-hidden pointer-events-none"
            : "opacity-100 max-h-[60px]"
        }`}
      >
        <div className="flex items-center gap-3 pl-3">
          <span className="material-symbols-outlined text-gold-classic">search</span>
          <span className="text-sm font-sans font-semibold text-cream-foundation select-none">
            Buscar imóvel por localização, tipo, quartos...
          </span>
        </div>
        <button
          type="button"
          className="bg-gold-classic hover:bg-gold-champagne text-forest-deep font-bold px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          Filtrar
          <span className="material-symbols-outlined text-[10px]">tune</span>
        </button>
      </div>

      {/* Expanded content container */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isExpanded
            ? "opacity-100 max-h-[800px] translate-y-0"
            : "opacity-0 max-h-0 translate-y-[-10px] overflow-hidden pointer-events-none"
        }`}
      >
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
          {/* Nome do Condomínio (Destaque) */}
          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor={`${uid}-hero-condominio`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-bold font-sans">
              Condomínio
            </label>
            <div className="bg-white rounded-lg px-4 py-2.5 flex items-center border border-gold-champagne/45 shadow-sm text-forest-deep focus-within:border-gold-classic focus-within:ring-1 focus-within:ring-gold-classic">
              <span className="material-symbols-outlined text-gold-classic mr-3" aria-hidden="true">search</span>
              <input
                id={`${uid}-hero-condominio`}
                type="text"
                value={condominio}
                onChange={(e) => setCondominio(e.target.value)}
                placeholder="Qual condomínio você procura? (Ex: Yachthouse, Iconic, etc.)"
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm md:text-base font-sans font-medium text-forest-deep placeholder:text-forest-mid/50"
              />
            </div>
          </div>

          {/* Row 1: Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Localização */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor={`${uid}-hero-location`} className="sr-only">Localização</label>
              <div className="bg-white rounded-lg px-4 py-3 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep focus-within:border-gold-classic focus-within:ring-1 focus-within:ring-gold-classic">
                <span className="material-symbols-outlined text-gold-classic mr-2" aria-hidden="true">keyboard_arrow_right</span>
                <select
                  id={`${uid}-hero-location`}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-sans font-medium text-forest-deep cursor-pointer appearance-none"
                >
                  <option value="" className="text-forest-deep">Localização</option>
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l} className="text-forest-deep">
                      {l}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-forest-mid/60 absolute right-3 pointer-events-none" aria-hidden="true">expand_more</span>
              </div>
            </div>

            {/* Tipo do Imóvel */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor={`${uid}-hero-type`} className="sr-only">Tipo do Imóvel</label>
              <div className="bg-white rounded-lg px-4 py-3 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep focus-within:border-gold-classic focus-within:ring-1 focus-within:ring-gold-classic">
                <span className="material-symbols-outlined text-gold-classic mr-2" aria-hidden="true">keyboard_arrow_right</span>
                <select
                  id={`${uid}-hero-type`}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-sans font-medium text-forest-deep cursor-pointer appearance-none"
                >
                  <option value="" className="text-forest-deep">Tipo do Imóvel</option>
                  {TYPES.map((t) => (
                    <option key={t} value={t} className="text-forest-deep">
                      {t}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-forest-mid/60 absolute right-3 pointer-events-none" aria-hidden="true">expand_more</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor={`${uid}-hero-status`} className="sr-only">Status</label>
              <div className="bg-white rounded-lg px-4 py-3 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep focus-within:border-gold-classic focus-within:ring-1 focus-within:ring-gold-classic">
                <span className="material-symbols-outlined text-gold-classic mr-2" aria-hidden="true">keyboard_arrow_right</span>
                <select
                  id={`${uid}-hero-status`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-sans font-medium text-forest-deep cursor-pointer appearance-none"
                >
                  <option value="" className="text-forest-deep">Status</option>
                  <option value="pronto" className="text-forest-deep">Pronto para morar</option>
                  <option value="construcao" className="text-forest-deep">Em construção</option>
                  <option value="lancamento" className="text-forest-deep">Lançamento</option>
                </select>
                <span className="material-symbols-outlined text-forest-mid/60 absolute right-3 pointer-events-none" aria-hidden="true">expand_more</span>
              </div>
            </div>
          </div>

          {/* Row 2: Pills (Quartos, Suítes, Vagas) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Quartos */}
            <div className="flex flex-col gap-1.5">
              <span id={`${uid}-hero-bedrooms-label`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-bold font-sans">
                Quartos
              </span>
              <div role="group" aria-labelledby={`${uid}-hero-bedrooms-label`} className="bg-white rounded-lg p-2 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep">
                <span className="material-symbols-outlined text-forest-mid/60 mr-2 ml-1" aria-hidden="true">bed</span>
                <div className="flex items-center gap-1.5 w-full pr-1">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      aria-pressed={bedrooms === num}
                      aria-label={`${num} ${num === 1 ? "quarto" : "quartos"}`}
                      onClick={() => setBedrooms(bedrooms === num ? undefined : num)}
                      className={`flex-1 max-w-11 h-11 rounded-md text-xs font-bold font-sans transition-all flex items-center justify-center cursor-pointer ${
                        bedrooms === num
                          ? "bg-gold-classic text-forest-deep"
                          : "text-forest-deep hover:bg-cream-stone/40"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Suítes */}
            <div className="flex flex-col gap-1.5">
              <span id={`${uid}-hero-suites-label`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-bold font-sans">
                Suítes
              </span>
              <div role="group" aria-labelledby={`${uid}-hero-suites-label`} className="bg-white rounded-lg p-2 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep">
                <span className="material-symbols-outlined text-forest-mid/60 mr-2 ml-1" aria-hidden="true">king_bed</span>
                <div className="flex items-center gap-1.5 w-full pr-1">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      aria-pressed={suites === num}
                      aria-label={`${num} ${num === 1 ? "suíte" : "suítes"}`}
                      onClick={() => setSuites(suites === num ? undefined : num)}
                      className={`flex-1 max-w-11 h-11 rounded-md text-xs font-bold font-sans transition-all flex items-center justify-center cursor-pointer ${
                        suites === num
                          ? "bg-gold-classic text-forest-deep"
                          : "text-forest-deep hover:bg-cream-stone/40"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vagas */}
            <div className="flex flex-col gap-1.5">
              <span id={`${uid}-hero-parking-label`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-bold font-sans">
                Vagas
              </span>
              <div role="group" aria-labelledby={`${uid}-hero-parking-label`} className="bg-white rounded-lg p-2 flex items-center border border-cream-stone/40 shadow-sm text-forest-deep">
                <span className="material-symbols-outlined text-forest-mid/60 mr-2 ml-1" aria-hidden="true">directions_car</span>
                <div className="flex items-center gap-1.5 w-full pr-1">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      aria-pressed={parking === num}
                      aria-label={`${num} ${num === 1 ? "vaga" : "vagas"}`}
                      onClick={() => setParking(parking === num ? undefined : num)}
                      className={`flex-1 max-w-11 h-11 rounded-md text-xs font-bold font-sans transition-all flex items-center justify-center cursor-pointer ${
                        parking === num
                          ? "bg-gold-classic text-forest-deep"
                          : "text-forest-deep hover:bg-cream-stone/40"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Price Inputs, Range Slider, & Search Button */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
            {/* Min/Max Inputs */}
            <div className="lg:col-span-4 flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-bold font-sans">
                Valor
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor={`${uid}-hero-min-price`} className="text-[9px] uppercase tracking-wider text-cream-foundation font-semibold font-sans">Mínimo</label>
                  <input
                    id={`${uid}-hero-min-price`}
                    type="text"
                    value={minPrice === 0 ? "R$ 0" : formatBRL(minPrice)}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    className="w-full bg-forest-deep border border-gold-champagne/60 rounded-lg p-2.5 text-xs text-cream-foundation font-sans font-semibold focus:outline-none focus:border-gold-classic"
                    placeholder="R$ 0"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor={`${uid}-hero-max-price`} className="text-[9px] uppercase tracking-wider text-cream-foundation font-semibold font-sans">Máximo</label>
                  <input
                    id={`${uid}-hero-max-price`}
                    type="text"
                    value={maxPrice === 50000000 ? "R$ 50M+" : formatBRL(maxPrice)}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    className="w-full bg-forest-deep border border-gold-champagne/60 rounded-lg p-2.5 text-xs text-cream-foundation font-sans font-semibold focus:outline-none focus:border-gold-classic"
                    placeholder="R$ 50.000.000"
                  />
                </div>
              </div>
            </div>

            {/* Range Slider */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <label htmlFor={`${uid}-hero-range`} className="sr-only">Valor máximo (controle deslizante)</label>
              <input
                id={`${uid}-hero-range`}
                type="range"
                min="0"
                max="50000000"
                step="500000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-gold-champagne/30 rounded-lg appearance-none cursor-pointer accent-gold-classic"
              />
              <div className="flex justify-between text-[10px] text-cream-foundation font-sans font-semibold">
                <span>R$ 0,00</span>
                <span>R$ 50.000.000,00</span>
              </div>
            </div>

            {/* Submit and Collapse Buttons */}
            <div className="lg:col-span-3">
              <div className="flex gap-2">
                {showCollapse && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="bg-transparent border border-gold-champagne/40 hover:border-gold-classic text-gold-champagne transition-all duration-300 px-3 py-3.5 rounded-lg flex items-center justify-center cursor-pointer"
                    title="Recolher filtros"
                  >
                    <span className="material-symbols-outlined">expand_less</span>
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-gold-classic hover:bg-gold-champagne text-forest-deep transition-all duration-300 font-bold px-6 py-3.5 rounded-lg text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                >
                  Buscar agora
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
