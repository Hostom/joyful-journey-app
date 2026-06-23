import type { Property } from "@/data/properties";

export function InquiryCTA({ property }: { property: Property }) {
  const msg = encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${property.name}" (${property.neighborhood}). Poderiam me enviar mais informações?`,
  );
  const subject = encodeURIComponent(`Interesse — ${property.name}`);
  return (
    <section className="bg-forest-deep text-cream-foundation py-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-champagne mb-6">
          Atendimento Privado
        </p>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
          Interessado neste{" "}
          <em className="italic text-gold-champagne">endereço</em>?
        </h2>
        <p className="text-cream-foundation/80 max-w-xl mx-auto mb-10">
          Agende uma visita privada ou solicite o book completo com plantas,
          tour virtual e condições comerciais.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`https://wa.me/5547999999999?text=${msg}`}
            className="inline-flex items-center gap-3 bg-gold-classic text-forest-deep px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            WhatsApp Concierge
          </a>
          <a
            href={`mailto:contato@fenomenoimoveis.com.br?subject=${subject}&body=${msg}`}
            className="inline-flex items-center gap-3 border border-cream-foundation/30 px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-gold-champagne hover:text-gold-champagne transition-colors"
          >
            <span className="material-symbols-outlined text-base">mail</span>
            Solicitar Book
          </a>
        </div>
      </div>
    </section>
  );
}
