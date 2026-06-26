import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyGallery } from "@/components/fenomeno/PropertyGallery";
import { InquiryCTA } from "@/components/fenomeno/InquiryCTA";
import { ContactLeadModal } from "@/components/fenomeno/ContactLeadModal";
import type { Property } from "@/data/properties";

type PropertyDetailModalProps = {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
};

export function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
  const [leadOpen, setLeadOpen] = useState(false);
  if (!property) return null;

  const whatsappUrl = `https://wa.me/5547999837494?text=${encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${property.name}" (Código: ${property.code}).`,
  )}`;

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
