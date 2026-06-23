import { useState } from "react";

export function PropertyGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden bg-forest-deep/5">
        <img
          src={images[active]}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] overflow-hidden ${
                i === active
                  ? "ring-2 ring-gold-classic"
                  : "opacity-70 hover:opacity-100"
              } transition-all`}
            >
              <img
                src={src}
                alt={`${alt} — ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
