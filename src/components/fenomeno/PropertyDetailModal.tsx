import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyGallery } from "@/components/fenomeno/PropertyGallery";
import { InquiryCTA } from "@/components/fenomeno/InquiryCTA";
import { ContactLeadModal } from "@/components/fenomeno/ContactLeadModal";
import type { Property } from "@/data/properties";
import { PropertyMap } from "@/components/fenomeno/PropertyMap";
import { supabase } from "@/integrations/supabase/client";
import {
  GraduationCap,
  ShoppingCart,
  HeartPulse,
  Dumbbell,
  Compass,
  MapPin,
  Check,
  MessageSquare,
  Ruler,
  Bed,
  Bath,
  Car,
  Loader2,
} from "lucide-react";

type PropertyDetailModalProps = {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
};

const CATEGORY_OPTIONS = [
  { id: "escola", label: "Escolas", Icon: GraduationCap, iconColor: "text-blue-400" },
  { id: "mercado", label: "Mercados", Icon: ShoppingCart, iconColor: "text-emerald-400" },
  { id: "farmacia", label: "Farmácias", Icon: HeartPulse, iconColor: "text-red-400" },
  { id: "academia", label: "Academias", Icon: Dumbbell, iconColor: "text-purple-400" },
];

function haversineDist(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi = ((lat2 - lat1) * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Busca comércios reais na API pública do OpenStreetMap Overpass
async function fetchOverpassPlaces(lat: number, lng: number, categoryList: string[]) {
  const query = `
    [out:json][timeout:6];
    (
      node["amenity"="school"](around:1600,${lat},${lng});
      node["shop"="supermarket"](around:1600,${lat},${lng});
      node["shop"="convenience"](around:1600,${lat},${lng});
      node["amenity"="pharmacy"](around:1600,${lat},${lng});
      node["leisure"="fitness_centre"](around:1600,${lat},${lng});
      node["sport"="fitness"](around:1600,${lat},${lng});
    );
    out body 25;
  `;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.elements)) return [];

    return data.elements
      .map((el: any) => {
        const pLat = el.lat;
        const pLng = el.lon;
        const name = el.tags?.name;
        if (!name || !pLat || !pLng) return null;
        const dist = Math.round(haversineDist(lat, lng, pLat, pLng));
        const tags = el.tags || {};
        let type = "outros";
        if (tags.amenity === "school") type = "escola";
        else if (tags.shop === "supermarket" || tags.shop === "convenience") type = "mercado";
        else if (tags.amenity === "pharmacy") type = "farmacia";
        else if (tags.leisure === "fitness_centre" || tags.sport === "fitness") type = "academia";
        
        return { name, type, distance: dist, coordinates: { latitude: pLat, longitude: pLng } };
      })
      .filter((p: any) => p && categoryList.includes(p.type));
  } catch {
    return [];
  }
}

const getCoordinates = (property: Property): { lat: number; lng: number } | null => {
  if (
    property.latitude !== undefined &&
    property.latitude !== null &&
    property.longitude !== undefined &&
    property.longitude !== null
  ) {
    const lat = Number(property.latitude);
    const lng = Number(property.longitude);
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return { lat, lng };
    }
  }
  return null;
};


export function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
  const [leadOpen, setLeadOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["escola", "mercado", "farmacia", "academia"]);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(() => (property ? getCoordinates(property) : null));

  const locationCtx = property ? `${property.location} ${property.neighborhood}` : "";

  useEffect(() => {
    if (!property) return;

    const initialCoords = getCoordinates(property);
    setCoords(initialCoords);

    if (
      property.latitude !== undefined &&
      property.latitude !== null &&
      property.longitude !== undefined &&
      property.longitude !== null
    ) {
      const latNum = Number(property.latitude);
      const lngNum = Number(property.longitude);
      if (!isNaN(latNum) && !isNaN(lngNum) && latNum !== 0 && lngNum !== 0 && latNum >= -27.20 && latNum <= -26.88) {
        return;
      }
    }

    let cancelled = false;
    const queryStreet = [property.name, property.neighborhood, property.location, "Santa Catarina", "Brasil"]
      .filter(Boolean)
      .join(", ");

    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStreet)}&format=json&limit=1&countrycodes=br`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          if (!isNaN(lat) && !isNaN(lng) && lat >= -27.20 && lat <= -26.88 && lng >= -48.67 && lng <= -48.55) {
            setCoords({ lat, lng });
            return;
          }
        }

        const queryNeigh = [property.neighborhood, property.location, "Santa Catarina", "Brasil"]
          .filter(Boolean)
          .join(", ");

        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryNeigh)}&format=json&limit=1&countrycodes=br`)
          .then((res) => res.json())
          .then((data2) => {
            if (cancelled) return;
            if (Array.isArray(data2) && data2.length > 0 && data2[0].lat && data2[0].lon) {
              const lat = parseFloat(data2[0].lat);
              const lng = parseFloat(data2[0].lon);
              if (!isNaN(lat) && !isNaN(lng) && lat >= -27.20 && lat <= -26.88 && lng >= -48.67 && lng <= -48.55) {
                setCoords({ lat, lng });
              }
            }
          })
          .catch(() => {});
      })
      .catch((err) => console.warn("Geocoding Nominatim:", err));

    return () => {
      cancelled = true;
    };
  }, [property?.code]);

  useEffect(() => {
    // Reset places whenever the property changes; only real API results should populate.
    setPlaces([]);
  }, [property?.code]);

  if (!property) return null;

  const whatsappUrl = `https://wa.me/5547999837494?text=${encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${property.name}" (Código: ${property.code}).`,
  )}`;

  const lat = coords?.lat ?? 0;
  const lng = coords?.lng ?? 0;
  const hasCoords = coords !== null;

  const fetchNearbyPlaces = async () => {
    if (selectedCategories.length === 0 || !hasCoords) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("nearby-places", {
        body: {
          latitude: lat,
          longitude: lng,
          categories: selectedCategories,
        },
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        setPlaces(data);
        return;
      }

      const overpassPlaces = await fetchOverpassPlaces(lat, lng, selectedCategories);
      setPlaces(overpassPlaces);
    } catch {
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };


  const handleToggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass3d bg-transparent border-none shadow-none text-cream-foundation max-w-[92vw] lg:max-w-[75vw] max-h-[88vh] p-6 md:p-10 focus:outline-none flex flex-col rounded-lg">
        <div className="overflow-y-auto flex-1 pr-1 lg:pr-3 mt-4">
          {/* Main Grid */}
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 md:gap-12 items-start">
            {/* Gallery */}
            <div className="rounded-lg overflow-hidden border border-gold-champagne/15 bg-black/10 p-1">
              <PropertyGallery images={property.images} alt={property.name} />
            </div>

            {/* Core Info */}
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-gold-champagne mb-3 font-semibold">
                  {property.type} · Exclusivo
                </p>
                <h2 className="font-display text-3xl md:text-4xl leading-tight mb-3 text-cream-foundation">
                  {property.name}
                </h2>
                <p className="text-cream-foundation/70 mb-6 font-sans">
                  {property.neighborhood} · {property.location}
                </p>
                <div className="font-display text-3xl text-gold-champagne mb-6 font-medium">{property.priceLabel}</div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 py-5 border-y border-cream-foundation/10">
                  <Spec iconType="area" label="Área" value={`${property.area} m²`} />
                  <Spec iconType="bedrooms" label="Dormitórios" value={String(property.bedrooms)} />
                  <Spec iconType="suites" label="Suítes" value={String(property.suites)} />
                  <Spec iconType="parking" label="Vagas" value={String(property.parking)} />
                </div>

                {hasCoords && (
                <div className="mt-6 pt-5 border-t border-cream-foundation/10 space-y-4">


                <div className="mt-6 pt-5 border-t border-cream-foundation/10 space-y-4">
                  <h3 className="font-display text-lg text-gold-champagne">
                    Localização e Comodidades
                  </h3>

                  {/* Compact Map */}
                  <div className="w-full">
                    <PropertyMap
                      latitude={lat}
                      longitude={lng}
                      propertyName={property.name}
                      nearbyPlaces={places}
                      height="220px"
                    />
                  </div>

                  {/* Nearby Places Controls */}
                  <div className="bg-forest-deep/40 border border-gold-champagne/15 p-4 rounded-xl backdrop-blur-md">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-champagne font-bold mb-3 font-sans">
                      Comércios Próximos
                    </h4>

                    {/* Category selectors */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {CATEGORY_OPTIONS.map((opt) => {
                        const IconComponent = opt.Icon;
                        const isSelected = selectedCategories.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleToggleCategory(opt.id)}
                            className={`flex items-center gap-2 p-2 border rounded-lg text-[11px] transition-all duration-300 font-sans cursor-pointer ${
                              isSelected
                                ? "bg-gold-classic border-gold-classic text-forest-deep font-bold"
                                : "border-gold-champagne/20 hover:border-gold-champagne/40 text-cream-foundation/80 hover:bg-white/5"
                            }`}
                          >
                            <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? "text-forest-deep" : opt.iconColor}`} />
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Fetch Button */}
                    <button
                      type="button"
                      onClick={fetchNearbyPlaces}
                      disabled={loading || selectedCategories.length === 0}
                      className="w-full bg-transparent hover:bg-gold-classic border border-gold-classic/50 hover:border-gold-classic text-gold-classic hover:text-forest-deep font-bold text-[10px] uppercase tracking-[0.2em] py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Buscando...</span>
                        </>
                      ) : (
                        <>
                          <Compass className="w-3.5 h-3.5" />
                          <span>Buscar Próximos</span>
                        </>
                      )}
                    </button>

                    {/* Places Results List */}
                    <div className="mt-4 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {places.length > 0 ? (
                        places.map((place, idx) => {
                          const opt = CATEGORY_OPTIONS.find((o) => o.id === place.type) || { Icon: MapPin, iconColor: "text-gold-champagne" };
                          const IconComponent = opt.Icon;
                          return (
                            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-cream-foundation/5 text-[11px] font-sans">
                              <div className="flex items-center gap-2 min-w-0">
                                <IconComponent className={`w-3.5 h-3.5 shrink-0 ${opt.iconColor}`} />
                                <span className="font-medium text-cream-foundation/90 truncate">{place.name}</span>
                              </div>
                              <span className="text-[9px] font-mono text-gold-champagne/90 bg-gold-champagne/5 px-2 py-0.5 rounded flex-shrink-0 ml-2">
                                {place.distance >= 1000 ? `${(place.distance / 1000).toFixed(1)} km` : `${place.distance} m`}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-cream-foundation/40 text-[10px] font-sans">
                          <MapPin className="w-6 h-6 mb-1 text-gold-champagne/40 block mx-auto" />
                          <p className="max-w-[180px] mx-auto leading-relaxed">
                            Selecione as categorias e busque para listar comércios da região.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA WhatsApp */}
              <button
                type="button"
                onClick={() => setLeadOpen(true)}
                className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-gold-classic hover:bg-gold-champagne text-forest-deep hover:scale-[1.01] transition-all duration-300 font-bold px-8 py-4 text-xs uppercase tracking-[0.25em] shadow-lg h-[52px] rounded cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Falar com Consultor
              </button>
            </div>
          </div>

          {/* Detailed Description & Features */}
          <div className="grid lg:grid-cols-[1.1fr_1.2fr] gap-12 mt-12 pt-10 border-t border-cream-foundation/10">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gold-champagne mb-4 font-sans font-bold">
                Sobre o imóvel
              </p>
              <h3 className="font-display text-2xl md:text-3xl leading-tight mb-6 text-cream-foundation">
                Um endereço <em className="italic text-gold-champagne">único</em>.
              </h3>
              <div className="space-y-4 text-cream-foundation/80 leading-relaxed whitespace-pre-line text-sm md:text-base font-sans">
                {property.description}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gold-champagne mb-4 font-sans font-bold">
                Características
              </p>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
                {property.features.map((f: string) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm font-sans">
                    <Check className="w-4 h-4 text-gold-champagne mt-0.5 shrink-0" />
                    <span className="text-cream-foundation/90 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Inquiry Form inside glass card */}
          <div className="mt-12 rounded-xl overflow-hidden border border-gold-champagne/20 bg-forest-deep/30 backdrop-blur-sm mb-4">
            <InquiryCTA property={property} className="bg-transparent text-cream-foundation py-12 px-6 lg:px-12" />
          </div>
        </div>
      </DialogContent>
      <ContactLeadModal
        open={leadOpen}
        onOpenChange={setLeadOpen}
        channel="whatsapp"
        redirectUrl={whatsappUrl}
        defaultMessage={`Olá! Tenho interesse no imóvel "${property.name}" (Código: ${property.code}).`}
        propertyId={property.code}
      />
    </Dialog>
  );
}

function Spec({ iconType, label, value }: { iconType: "area" | "bedrooms" | "suites" | "parking"; label: string; value: string }) {
  const IconComponent =
    iconType === "area"
      ? Ruler
      : iconType === "bedrooms"
      ? Bed
      : iconType === "suites"
      ? Bath
      : Car;

  return (
    <div className="flex items-center gap-3">
      <IconComponent className="w-5 h-5 text-gold-champagne shrink-0" />
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-cream-foundation/60 font-sans font-bold">
          {label}
        </div>
        <div className="font-semibold text-sm font-sans text-cream-foundation">{value}</div>
      </div>
    </div>
  );
}
