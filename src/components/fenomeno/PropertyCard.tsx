import { Link } from "@tanstack/react-router";
import type { Property } from "@/data/properties";
import { useState } from "react";

export function PropertyCard({
  property,
  index = 0,
  onSelect,
}: {
  property: Property;
  index?: number;
  onSelect?: (property: Property) => void;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(property);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(!isFav);
  };

  const propertyCode = `IM${property.code}`;

  return (
    <Link
      to="/imoveis/$code"
      params={{ code: property.code }}
      onClick={handleClick}
      className="reveal-up group block h-full"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-cream-stone/60 hover:border-gold-classic/40 hover:-translate-y-1">
        {/* Image wrapper — taller to dominate the card */}
        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-[16/11] w-full bg-cream-stone/30">
          <img
            src={property.images[imgIndex]}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient overlay at bottom of image for readability */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          {/* Tag */}
          <div className="absolute top-4 left-4 bg-forest-deep/90 text-cream-foundation px-3.5 py-1.5 rounded-md text-[10px] uppercase tracking-[0.15em] font-bold font-sans z-10 backdrop-blur-sm">
            {property.type}
          </div>

          {/* Heart button */}
          <button
            type="button"
            onClick={handleToggleFav}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-forest-deep transition-all duration-200 z-10 cursor-pointer hover:scale-110"
            aria-label="Adicionar aos favoritos"
          >
            <span
              className={`material-symbols-outlined text-lg ${isFav ? "text-red-500" : "text-forest-deep/60"}`}
              style={isFav ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              favorite
            </span>
          </button>

          {/* Carousel Arrows */}
          {property.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-forest-deep shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer hover:scale-110"
                aria-label="Imagem anterior"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-forest-deep shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer hover:scale-110"
                aria-label="Próxima imagem"
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </>
          )}

          {/* Image dots */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {property.images.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    imgIndex === i ? "bg-white scale-125" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content details — spacious with bold typography */}
        <div className="flex-1 flex flex-col justify-between p-5 lg:p-6">
          <div>
            {/* Location row */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-gold-classic text-sm">location_on</span>
              <span className="text-xs font-sans font-semibold text-forest-mid/70 tracking-wide">
                {property.neighborhood} · {property.location}
              </span>
            </div>

            {/* Title — larger, bolder */}
            <h3 className="text-lg md:text-xl font-sans font-extrabold text-forest-deep group-hover:text-gold-classic transition-colors duration-300 line-clamp-2 leading-tight mb-3">
              {property.name} em {property.location}
            </h3>

            {/* Code */}
            <span className="text-[10px] text-forest-mid/40 font-mono tracking-widest block mb-3">{propertyCode}</span>

            {/* Specifications — with icons */}
            <div className="flex items-center gap-3 text-xs text-forest-mid/80 font-sans font-semibold flex-wrap mb-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-forest-mid/40 text-sm">straighten</span>
                {property.area}m²
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-forest-mid/40 text-sm">bed</span>
                {property.bedrooms} {property.bedrooms === 1 ? "quarto" : "quartos"}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-forest-mid/40 text-sm">directions_car</span>
                {property.parking} {property.parking === 1 ? "vaga" : "vagas"}
              </span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between pt-5 border-t border-forest-deep/8 mt-4">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.2em] text-forest-mid/50 font-sans font-bold mb-0.5">
                {property.price > 0 ? "A partir de" : "Valor"}
              </span>
              <span className="text-xl font-sans font-black text-forest-deep tracking-tight">
                {property.priceLabel}
              </span>
            </div>
            <button
              type="button"
              className="bg-forest-deep hover:bg-gold-classic text-cream-foundation hover:text-forest-deep font-sans font-bold px-5 py-2.5 rounded-lg text-[11px] uppercase tracking-[0.12em] transition-all duration-300 shrink-0 cursor-pointer shadow-sm hover:shadow-md"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
