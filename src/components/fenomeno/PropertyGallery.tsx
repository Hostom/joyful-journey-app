import { useEffect, useRef, useState } from "react";

export function PropertyGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const hasImages = images.length > 0;

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  };

  const goPrev = () => {
    if (!hasImages) return;
    const next = (index - 1 + images.length) % images.length;
    setIndex(next);
    scrollToIndex(next);
  };
  const goNext = () => {
    if (!hasImages) return;
    const next = (index + 1) % images.length;
    setIndex(next);
    scrollToIndex(next);
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth;
    const i = Math.round(el.scrollLeft / slideWidth);
    if (i !== index) setIndex(i);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (hasImages) {
        setLightboxIndex(index);
        setLightboxOpen(true);
      }
    }
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i + 1) % images.length);
      else if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, images.length]);

  if (!hasImages) {
    return (
      <div className="relative aspect-[16/10] bg-forest-deep flex items-center justify-center text-cream-foundation/85 text-sm">
        Sem fotos disponíveis
      </div>
    );
  }

  return (
    <>
      <div
        ref={wrapRef}
        role="region"
        aria-label={`Galeria de fotos: ${alt}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative outline-none focus-visible:ring-2 focus-visible:ring-gold-classic rounded"
      >
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar aspect-[16/10] rounded"
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="snap-center shrink-0 w-full h-full"
            >
              <img
                src={src}
                alt={`${alt} — ${i + 1}`}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover cursor-zoom-in"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-cream-foundation transition"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Próxima foto"
              className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-cream-foundation transition"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-gold-classic" : "w-1.5 bg-cream-foundation/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2 mt-2">
          {images.map((src, i) => (
            <button
              key={`${src}-thumb-${i}`}
              type="button"
              onClick={() => {
                setIndex(i);
                scrollToIndex(i);
              }}
              className={`relative aspect-[4/3] overflow-hidden rounded ${
                i === index
                  ? "ring-2 ring-gold-classic"
                  : "opacity-70 hover:opacity-100"
              } transition-all`}
            >
              <img
                src={src}
                alt={`${alt} — miniatura ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            aria-label="Fechar"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-cream-foundation"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i - 1 + images.length) % images.length);
                }}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-cream-foundation"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i + 1) % images.length);
                }}
                aria-label="Próxima foto"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-cream-foundation"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </>
          )}
          <img
            src={images[lightboxIndex]}
            alt={`${alt} — ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            decoding="async"
            className="max-w-full max-h-full object-contain p-6"
          />
        </div>
      )}
    </>
  );
}
