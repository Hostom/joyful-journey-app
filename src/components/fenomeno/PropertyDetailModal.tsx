import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyGallery } from "@/components/fenomeno/PropertyGallery";
import { InquiryCTA } from "@/components/fenomeno/InquiryCTA";
import { ContactLeadModal } from "@/components/fenomeno/ContactLeadModal";
import type { Property } from "@/data/properties";
import { PropertyMap } from "@/components/fenomeno/PropertyMap";
import { supabase } from "@/integrations/supabase/client";

type PropertyDetailModalProps = {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
};

const CATEGORY_OPTIONS = [
  { id: "escola", label: "Escolas", icon: "school", iconColor: "text-blue-400" },
  { id: "mercado", label: "Mercados", icon: "shopping_cart", iconColor: "text-emerald-400" },
  { id: "farmacia", label: "Farmácias", icon: "medical_services", iconColor: "text-red-400" },
  { id: "academia", label: "Academias", icon: "fitness_center", iconColor: "text-purple-400" },
];

const getCoordinates = (property: Property): { lat: number; lng: number } | null => {
  if (
    typeof property.latitude === "number" &&
    typeof property.longitude === "number" &&
    !isNaN(property.latitude) &&
    !isNaN(property.longitude)
  ) {
    return { lat: property.latitude, lng: property.longitude };
  }
  return null;
};

export function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
  const [leadOpen, setLeadOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["escola", "mercado", "farmacia", "academia"]);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Limpa locais ao trocar de imóvel
  useEffect(() => {
    setPlaces([]);
  }, [property?.code]);

  if (!property) return null;

  const whatsappUrl = `https://wa.me/5547999837494?text=${encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${property.name}" (Código: ${property.code}).`,
  )}`;

  const { lat, lng } = getCoordinates(property);

  const fetchNearbyPlaces = async () => {
    if (selectedCategories.length === 0) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("nearby-places", {
        body: {
          latitude: lat,
          longitude: lng,
          categories: selectedCategories,
        },
      });

      if (error) {
        console.error("Erro ao carregar comércios próximos:", error);
      } else if (Array.isArray(data)) {
        setPlaces(data);
      }
    } catch (err) {
      console.error("Exceção ao carregar comércios próximos:", err);
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
                  <Spec icon="straighten" label="Área" value={`${property.area} m²`} />
                  <Spec icon="bed" label="Dormitórios" value={String(property.bedrooms)} />
                  <Spec icon="shower" label="Suítes" value={String(property.suites)} />
                  <Spec icon="garage" label="Vagas" value={String(property.parking)} />
                </div>

                {/* Map and Nearby Places Section */}
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
                      {CATEGORY_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleCategory(opt.id)}
                          className={`flex items-center gap-2 p-2 border rounded-lg text-[11px] transition-all duration-300 font-sans cursor-pointer ${
                            selectedCategories.includes(opt.id)
                              ? "bg-gold-classic border-gold-classic text-forest-deep font-bold"
                              : "border-gold-champagne/20 hover:border-gold-champagne/40 text-cream-foundation/80 hover:bg-white/5"
                          }`}
                        >
                          <span className={`material-symbols-outlined text-sm ${selectedCategories.includes(opt.id) ? "text-forest-deep" : opt.iconColor}`}>
                            {opt.icon}
                          </span>
                          <span>{opt.label}</span>
                        </button>
                      ))}
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
                          <span className="animate-spin material-symbols-outlined text-xs">progress_activity</span>
                          <span>Buscando...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xs">explore</span>
                          <span>Buscar Próximos</span>
                        </>
                      )}
                    </button>

                    {/* Places Results List */}
                    <div className="mt-4 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {places.length > 0 ? (
                        places.map((place, idx) => {
                          const opt = CATEGORY_OPTIONS.find((o) => o.id === place.type) || { icon: "place", iconColor: "text-gold-champagne" };
                          return (
                            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-cream-foundation/5 text-[11px] font-sans">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`material-symbols-outlined text-sm flex-shrink-0 ${opt.iconColor}`}>
                                  {opt.icon}
                                </span>
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
                          <span className="material-symbols-outlined text-2xl mb-1 text-gold-champagne/40 block">map</span>
                          <p className="max-w-[180px] mx-auto leading-relaxed">
                            Selecione as categorias e busque para listar comércios da região.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA WhatsApp - opens lead capture before WhatsApp */}
              <button
                type="button"
                onClick={() => setLeadOpen(true)}
                className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-gold-classic hover:bg-gold-champagne text-forest-deep hover:scale-[1.01] transition-all duration-300 font-bold px-8 py-4 text-xs uppercase tracking-[0.25em] shadow-lg h-[52px] rounded"
              >
                <span className="material-symbols-outlined text-base">chat</span>
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
                    <span className="material-symbols-outlined text-gold-champagne text-base mt-0.5 select-none">
                      check
                    </span>
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

function Spec({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-gold-champagne text-xl select-none">{icon}</span>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-cream-foundation/60 font-sans font-bold">
          {label}
        </div>
        <div className="font-semibold text-sm font-sans text-cream-foundation">{value}</div>
      </div>
    </div>
  );
}
