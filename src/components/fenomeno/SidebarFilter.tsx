import { useId, useState, useEffect } from "react";
import type { PropertyLocation, PropertyType } from "@/data/properties";
import { LOCATIONS, TYPES } from "@/data/properties";
import { Search, ChevronDown, X } from "lucide-react";

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

type SidebarFilterProps = {
  initialValues?: FilterValues;
  onSubmit: (values: FilterValues) => void;
  onClear: () => void;
};

export function SidebarFilter({
  initialValues,
  onSubmit,
  onClear,
}: SidebarFilterProps) {
  const [location, setLocation] = useState<string>(initialValues?.location ?? "");
  const [type, setType] = useState<string>(initialValues?.type ?? "");
  const [status, setStatus] = useState<string>("");
  const [condominio, setCondominio] = useState<string>(initialValues?.condominio ?? "");

  const [bedrooms, setBedrooms] = useState<number | undefined>(initialValues?.bedrooms);
  const [suites, setSuites] = useState<number | undefined>(initialValues?.suites);
  const [parking, setParking] = useState<number | undefined>(initialValues?.parking);

  const [minPrice, setMinPrice] = useState<number>(initialValues?.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState<number>(initialValues?.maxPrice ?? 50000000);

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

  const handleClearClick = () => {
    setLocation("");
    setType("");
    setStatus("");
    setBedrooms(undefined);
    setSuites(undefined);
    setParking(undefined);
    setMinPrice(0);
    setMaxPrice(50000000);
    setCondominio("");
    onClear();
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

  const uid = useId();

  const getPillClass = (isSelected: boolean) => {
    return isSelected
      ? "flex-1 max-w-11 h-11 rounded bg-gold-classic text-forest-deep border border-gold-classic text-sm font-extrabold font-sans transition-all flex items-center justify-center cursor-pointer shadow-md shadow-gold-classic/30 hover:bg-gold-champagne"
      : "flex-1 max-w-11 h-11 rounded border border-cream-foundation/30 text-white hover:bg-white/10 hover:border-cream-foundation/50 text-sm font-bold font-sans transition-all flex items-center justify-center cursor-pointer";
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex flex-col gap-6 w-full text-cream-foundation">
      <div className="pb-4 border-b border-cream-foundation/15">
        <h2 className="font-display text-2xl text-white font-normal leading-tight">
          Filtrar Imóveis
        </h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-condominio`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-extrabold font-sans">
          Condomínio
        </label>
        <div className="relative flex items-center border-b border-cream-foundation/40 focus-within:border-gold-classic transition-colors">
          <input
            id={`${uid}-condominio`}
            type="text"
            value={condominio}
            onChange={(e) => setCondominio(e.target.value)}
            placeholder="Buscar por condomínio..."
            className="w-full bg-transparent text-white outline-none py-2 pr-8 text-sm font-sans font-semibold placeholder:text-cream-foundation/40"
          />
          <Search className="text-gold-classic absolute right-1 bottom-2 pointer-events-none w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-location`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-extrabold font-sans">
          Localização
        </label>
        <div className="relative">
          <select
            id={`${uid}-location`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent border-b border-cream-foundation/40 focus:border-gold-classic text-white outline-none py-2 pr-8 text-sm font-sans font-semibold transition-colors cursor-pointer appearance-none"
          >
            <option value="" className="bg-forest-deep text-cream-foundation">Todas as localizações</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l} className="bg-forest-deep text-cream-foundation">
                {l}
              </option>
            ))}
          </select>
          <ChevronDown className="text-gold-classic absolute right-1 bottom-2 pointer-events-none w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-type`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-extrabold font-sans">
          Tipo do Imóvel
        </label>
        <div className="relative">
          <select
            id={`${uid}-type`}
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-transparent border-b border-cream-foundation/40 focus:border-gold-classic text-white outline-none py-2 pr-8 text-sm font-sans font-semibold transition-colors cursor-pointer appearance-none"
          >
            <option value="" className="bg-forest-deep text-cream-foundation">Todos os tipos</option>
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-forest-deep text-cream-foundation">
                {t}
              </option>
            ))}
          </select>
          <ChevronDown className="text-gold-classic absolute right-1 bottom-2 pointer-events-none w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-status`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-extrabold font-sans">
          Status
        </label>
        <div className="relative">
          <select
            id={`${uid}-status`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-transparent border-b border-cream-foundation/40 focus:border-gold-classic text-white outline-none py-2 pr-8 text-sm font-sans font-semibold transition-colors cursor-pointer appearance-none"
          >
            <option value="" className="bg-forest-deep text-cream-foundation">Todos os status</option>
            <option value="pronto" className="bg-forest-deep text-cream-foundation">Pronto para morar</option>
            <option value="construcao" className="bg-forest-deep text-cream-foundation">Em construção</option>
            <option value="lancamento" className="bg-forest-deep text-cream-foundation">Lançamento</option>
          </select>
          <ChevronDown className="text-gold-classic absolute right-1 bottom-2 pointer-events-none w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <span id={`${uid}-bedrooms-label`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-extrabold font-sans">
          Quartos mínimo
        </span>
        <div role="group" aria-labelledby={`${uid}-bedrooms-label`} className="flex items-center gap-1.5 w-full">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              aria-pressed={bedrooms === num}
              aria-label={`${num} ${num === 1 ? "quarto" : "quartos"} mínimo`}
              onClick={() => setBedrooms(bedrooms === num ? undefined : num)}
              className={getPillClass(bedrooms === num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <span id={`${uid}-suites-label`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-extrabold font-sans">
          Suítes mínimo
        </span>
        <div role="group" aria-labelledby={`${uid}-suites-label`} className="flex items-center gap-1.5 w-full">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              aria-pressed={suites === num}
              aria-label={`${num} ${num === 1 ? "suíte" : "suítes"} mínimo`}
              onClick={() => setSuites(suites === num ? undefined : num)}
              className={getPillClass(suites === num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <span id={`${uid}-parking-label`} className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-extrabold font-sans">
          Vagas de Garagem mínimo
        </span>
        <div role="group" aria-labelledby={`${uid}-parking-label`} className="flex items-center gap-1.5 w-full">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              aria-pressed={parking === num}
              aria-label={`${num} ${num === 1 ? "vaga" : "vagas"} de garagem mínimo`}
              onClick={() => setParking(parking === num ? undefined : num)}
              className={getPillClass(parking === num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[11px] uppercase tracking-[0.2em] text-gold-classic font-extrabold font-sans">
          Valor
        </span>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor={`${uid}-min-price`} className="text-[10px] uppercase tracking-wider text-cream-foundation/80 font-bold font-sans">
              Mínimo
            </label>
            <input
              id={`${uid}-min-price`}
              type="text"
              value={minPrice === 0 ? "" : formatBRL(minPrice)}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="w-full bg-transparent border-b border-cream-foundation/40 focus:border-gold-classic text-white outline-none py-1.5 text-sm font-sans font-semibold transition-colors placeholder:text-cream-foundation/50"
              placeholder="R$ 0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={`${uid}-max-price`} className="text-[10px] uppercase tracking-wider text-cream-foundation/80 font-bold font-sans">
              Máximo
            </label>
            <input
              id={`${uid}-max-price`}
              type="text"
              value={maxPrice === 50000000 ? "" : formatBRL(maxPrice)}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="w-full bg-transparent border-b border-cream-foundation/40 focus:border-gold-classic text-white outline-none py-1.5 text-sm font-sans font-semibold transition-colors placeholder:text-cream-foundation/50"
              placeholder="Sem Limite"
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <label htmlFor={`${uid}-range`} className="sr-only">Valor máximo (controle deslizante)</label>
          <input
            id={`${uid}-range`}
            type="range"
            min="0"
            max="50000000"
            step="500000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-cream-foundation/20 rounded-full appearance-none cursor-pointer accent-gold-classic focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-cream-foundation/90 font-sans font-bold">
            <span>R$ 0</span>
            <span>{maxPrice === 50000000 ? "Sem Limite" : formatBRL(maxPrice)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <button
          type="submit"
          className="w-full bg-gold-classic hover:bg-gold-champagne text-forest-deep hover:scale-[1.01] transition-all duration-300 font-bold px-4 py-3 rounded text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer shadow-md h-[42px]"
        >
          <Search className="w-4 h-4" />
          Aplicar Filtros
        </button>

        <button
          type="button"
          onClick={handleClearClick}
          className="w-full bg-transparent hover:bg-cream-foundation/5 text-cream-foundation/80 border border-cream-foundation/25 hover:border-cream-foundation transition-all duration-300 font-bold px-4 py-3 rounded text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer h-[42px]"
        >
          <X className="w-4 h-4" />
          Limpar Filtros
        </button>
      </div>
    </form>
  );
}
