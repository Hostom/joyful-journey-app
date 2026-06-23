import { Link } from "@tanstack/react-router";
import type { Property } from "@/data/properties";

export function PropertyCard({
  property,
  index = 0,
}: {
  property: Property;
  index?: number;
}) {
  return (
    <Link
      to="/imoveis/$slug"
      params={{ slug: property.slug }}
      className="reveal-up group block"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="relative overflow-hidden mb-6 aspect-[4/5]">
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-cream-foundation/95 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-forest-deep">
          {property.type}
        </div>
      </div>
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-display text-2xl">{property.name}</h3>
        <span className="text-xs uppercase tracking-widest text-gold-classic">
          {property.area} m²
        </span>
      </div>
      <p className="text-sm text-forest-mid/70 mb-4">
        {property.neighborhood} · {property.location}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-forest-deep/10">
        <span className="font-medium">{property.priceLabel}</span>
        <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-forest-deep group-hover:text-gold-classic transition-colors">
          Detalhes
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}
