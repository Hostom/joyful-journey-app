import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { findProperty, PROPERTIES } from "@/data/properties";
import { PropertyGallery } from "@/components/fenomeno/PropertyGallery";
import { InquiryCTA } from "@/components/fenomeno/InquiryCTA";
import { PropertyCard } from "@/components/fenomeno/PropertyCard";
import { Navbar } from "@/components/fenomeno/Navbar";
import { WhatsAppButton } from "@/components/fenomeno/WhatsAppButton";
import { BackToTop } from "@/components/fenomeno/BackToTop";
import { Footer } from "@/components/fenomeno/Footer";

export const Route = createFileRoute("/imoveis/$code")({
  loader: ({ params }) => {
    const property = findProperty(params.code);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.property;
    if (!p) return { meta: [{ title: "Imóvel | Fenômeno Imóveis" }] };
    return {
      meta: [
        { title: `${p.name} | Fenômeno Imóveis` },
        {
          name: "description",
          content: `${p.name} em ${p.neighborhood}, ${p.location}. ${p.area} m², ${p.bedrooms} suítes. ${p.priceLabel}.`,
        },
        {
          property: "og:title",
          content: `${p.name} | Fenômeno Imóveis`,
        },
        {
          property: "og:description",
          content: `${p.type} em ${p.location} — ${p.area} m², ${p.priceLabel}.`,
        },
        { property: "og:image", content: p.images[0] },
        { property: "twitter:image", content: p.images[0] },
      ],
    };
  },
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property } = Route.useLoaderData();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [property.code]);

  const related = PROPERTIES.filter(
    (p) => p.code !== property.code && (p.type === property.type || p.location === property.location),
  ).slice(0, 3);

  return (
    <div className="bg-cream-foundation text-forest-deep">
      <Navbar />

      <div className="pt-28 px-6 lg:px-12 max-w-7xl mx-auto">
        <Link
          to="/imoveis"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-forest-mid/70 hover:text-gold-classic mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar ao portfólio
        </Link>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
          <PropertyGallery images={property.images} alt={property.name} />

          <aside className="lg:sticky lg:top-32">
            <p className="text-xs uppercase tracking-[0.4em] text-gold-classic mb-4">{property.type} · Exclusivo</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3">{property.name}</h1>
            <p className="text-forest-mid/70 mb-8">
              {property.neighborhood} · {property.location}
            </p>
            <div className="font-display text-3xl text-gold-classic mb-8">{property.priceLabel}</div>
            <div className="grid grid-cols-2 gap-y-5 gap-x-6 py-6 border-y border-forest-deep/10">
              <Spec icon="straighten" label="Área" value={`${property.area} m²`} />
              <Spec icon="bed" label="Dormitórios" value={String(property.bedrooms)} />
              <Spec icon="shower" label="Suítes" value={String(property.suites)} />
              <Spec icon="garage" label="Vagas" value={String(property.parking)} />
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=5547999837494=${encodeURIComponent(
                `Olá! Tenho interesse no imóvel "${property.name}".`,
              )}`}
              className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-gold-classic text-forest-deep px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Falar com Concierge
            </a>
          </aside>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-[1fr_1.2fr] gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold-classic mb-6">Sobre o imóvel</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight mb-8">
            Um endereço <em className="italic text-gold-classic">único</em>.
          </h2>
          <div className="space-y-4 text-forest-mid/80 leading-relaxed whitespace-pre-line">{property.description}</div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold-classic mb-6">Características</p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {property.features.map((f: string) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className="material-symbols-outlined text-gold-classic text-base mt-0.5">check</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <InquiryCTA property={property} />

      {related.length > 0 && (
        <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-3xl md:text-4xl">
              Outros <em className="italic text-gold-classic">imóveis</em>
            </h2>
            <Link to="/imoveis" className="text-xs uppercase tracking-[0.25em] hover:text-gold-classic">
              Ver portfólio →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {related.map((p, i) => (
              <PropertyCard key={p.code} property={p} index={i} />
            ))}
          </div>
        </section>
      )}
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

function Spec({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-gold-classic">{icon}</span>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-forest-mid/60">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

/* DetailNav removed — using shared <Navbar /> */

function NotFoundPage() {
  return (
    <div className="bg-cream-foundation text-forest-deep min-h-screen flex flex-col items-center justify-center p-12 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-gold-classic mb-6">404</p>
      <h1 className="font-display text-5xl mb-4">Imóvel não encontrado.</h1>
      <p className="text-forest-mid/70 mb-8">Este endereço pode ter sido removido do portfólio.</p>
      <Link
        to="/imoveis"
        className="inline-flex items-center gap-2 border border-forest-deep/40 px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-forest-deep hover:text-cream-foundation"
      >
        Ver portfólio
      </Link>
    </div>
  );
}

function ErrorPage({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <div className="bg-cream-foundation text-forest-deep min-h-screen flex flex-col items-center justify-center p-12 text-center">
      <h1 className="font-display text-4xl mb-4">Algo deu errado.</h1>
      <button
        type="button"
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="inline-flex items-center gap-2 border border-forest-deep/40 px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-forest-deep hover:text-cream-foundation"
      >
        Tentar novamente
      </button>
    </div>
  );
}
