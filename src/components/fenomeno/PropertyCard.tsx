import { Link } from "@tanstack/react-router";
import type { Property } from "@/data/properties";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, ChevronLeft, ChevronRight, MapPin, Ruler, Bed, Car } from "lucide-react";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const hasImages = property.images.length > 0;
  const total = property.images.length;

  // When onSelect is provided (modal mode), we use a button/div wrapper so that
  // touch events on mobile don't trigger Link navigation before onClick fires.
  const handleCardClick = () => {
    if (onSelect) onSelect(property);
  };

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = el.clientWidth * i;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const goPrev = () => {
    const next = imgIndex === 0 ? total - 1 : imgIndex - 1;
    setImgIndex(next);
    scrollToIndex(next);
  };

  const goNext = () => {
    const next = imgIndex === total - 1 ? 0 : imgIndex + 1;
    setImgIndex(next);
    scrollToIndex(next);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goPrev();
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goNext();
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(!isFav);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLightboxIndex(imgIndex);
    setLightboxOpen(true);
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== imgIndex) setImgIndex(i);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (total <= 1) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      goNext();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      setLightboxIndex(imgIndex);
      setLightboxOpen(true);
    }
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (i === 0 ? total - 1 : i - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i === total - 1 ? 0 : i + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, total]);

  const propertyCode = `IM${property.code}`;

  // Wrapper: button (modal mode, safe on mobile) or Link (navigation mode)
  const CardWrapper = onSelect
    ? ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
        <button
          type="button"
          onClick={handleCardClick}
          className={className}
          style={style}
        >
          {children}
        </button>
      )
    : ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
        <Link
          to="/imoveis/$code"
          params={{ code: property.code }}
          className={className}
          style={style}
        >
          {children}
        </Link>
      );

  return (
    <>
    <CardWrapper
      className="reveal-up group block h-full text-left"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-cream-stone/60 hover:border-gold-classic/40 hover:-translate-y-1">
        {/* Image wrapper */}
        <div
          ref={imageWrapRef}
          className="relative overflow-hidden aspect-[4/3] lg:aspect-[16/11] w-full bg-cream-stone/30 outline-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="region"
          aria-label={`Fotos de ${property.name}. Use as setas do teclado para navegar.`}
        >
          {hasImages ? (
            <div
              ref={scrollerRef}
              onScroll={handleScroll}
              className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: "none" }}
            >
              {property.images.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative shrink-0 w-full h-full snap-center"
                >
                  <img
                    src={src}
                    alt={`${property.name} — foto ${i + 1}`}
                    onClick={i === imgIndex ? handleImageClick : undefined}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      i === imgIndex ? "cursor-zoom-in" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-forest-mid/40 text-xs font-sans">
              Sem fotos
            </div>
          )}

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
            <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-forest-deep/60"}`} />
          </button>

          {/* Carousel Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-forest-deep shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer hover:scale-110"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-forest-deep shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer hover:scale-110"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Image dots */}
          {total > 1 && (
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

        {/* Content details */}
        <div className="flex-1 flex flex-col justify-between p-5 lg:p-6">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-gold-classic shrink-0" />
              <span className="text-xs font-sans font-semibold text-forest-mid/70 tracking-wide">
                {property.neighborhood} · {property.location}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-sans font-extrabold text-forest-deep group-hover:text-gold-classic transition-colors duration-300 line-clamp-2 leading-tight mb-3">
              {property.name} em {property.location}
            </h3>

            <span className="text-[10px] text-forest-mid/40 font-mono tracking-widest block mb-3">{propertyCode}</span>

            <div className="flex items-center gap-3 text-xs text-forest-mid/80 font-sans font-semibold flex-wrap mb-1">
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-forest-mid/40 shrink-0" />
                {property.area}m²
              </span>
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-forest-mid/40 shrink-0" />
                {property.bedrooms} {property.bedrooms === 1 ? "quarto" : "quartos"}
              </span>
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-forest-mid/40 shrink-0" />
                {property.parking} {property.parking === 1 ? "vaga" : "vagas"}
              </span>
            </div>
          </div>

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
    </CardWrapper>

    {/* Lightbox */}
    <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
      <DialogContent className="bg-black/95 border-none shadow-none max-w-[96vw] lg:max-w-[90vw] max-h-[92vh] p-0 focus:outline-none">
        <div className="relative w-full h-[88vh] flex items-center justify-center">
          {hasImages && (
            <img
              src={property.images[lightboxIndex]}
              alt={`${property.name} — foto ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none"
            />
          )}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((i) => (i === 0 ? total - 1 : i - 1))
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((i) => (i === total - 1 ? 0 : i + 1))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs font-sans tracking-widest bg-black/40 px-3 py-1.5 rounded-full">
                {lightboxIndex + 1} / {total}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
