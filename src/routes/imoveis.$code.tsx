import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { propertiesQueryOptions } from "@/lib/properties.functions";
import type { Property } from "@/data/properties";
import { PropertyGallery } from "@/components/fenomeno/PropertyGallery";
import { InquiryCTA } from "@/components/fenomeno/InquiryCTA";
import { PropertyCard } from "@/components/fenomeno/PropertyCard";
import { Navbar } from "@/components/fenomeno/Navbar";
import { WhatsAppButton } from "@/components/fenomeno/WhatsAppButton";
import { BackToTop } from "@/components/fenomeno/BackToTop";
import { Footer } from "@/components/fenomeno/Footer";
import { Check, ArrowLeft, MessageSquare, Ruler, Bed, Bath, Car } from "lucide-react";

export const Route = createFileRoute("/imoveis/$code")({
  loader: async ({ params, context }) => {
    const props = await context.queryClient.ensureQueryData(propertiesQueryOptions);
    const property = props.find((p) => p.code === params.code);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.property;
    if (!p) return { meta: [{ title: "Imóvel | Fenômeno Imóveis" }] };
    const canonicalUrl = `https://fenomenoimoveis.lovable.app/imoveis/${p.code}`;
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      image: p.images,
      description: `${p.type} em ${p.neighborhood}, ${p.location}. ${p.area} m², ${p.bedrooms} suítes. ${p.priceLabel}.`,
      brand: {
        "@type": "Brand",
        name: "Fenômeno Imóveis",
      },
      offers: p.price && p.price > 0
        ? {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: String(p.price),
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
          }
        : undefined,
    };
    return {
      meta: [
        { title: `${p.name} | Fenômeno Imóveis` },
        {
          name: "description",
          content: `${p.name} em ${p.neighborhood}, ${p.location}. ${p.area} m², ${p.bedrooms} suítes. ${p.priceLabel}.`,
        },
        { property: "og:title", content: `${p.name} | Fenômeno Imóveis` },
        { property: "og:description", content: `${p.type} em ${p.location} — ${p.area} m², ${p.priceLabel}.` },
        { property: "og:image", content: p.images[0] },
        { property: "og:url", content: canonicalUrl },
        { property: "og:site_name", content: "Fenômeno Imóveis" },
        { property: "og:type", content: "product" },
        { name: "twitter:image", content: p.images[0] },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(productSchema),
        },
      ],
    };
  },
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property } = Route.useLoaderData();
  const { data: PROPERTIES } = useSuspenseQuery(propertiesQueryOptions);

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
          <ArrowLeft className="w-4 h-4" />
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
              <Spec iconType="area" label="Área" value={`${property.area} m²`} />
              <Spec iconType="bedrooms" label="Dormitórios" value={String(property.bedrooms)} />
              <Spec iconType="suites" label="Suítes" value={String(property.suites)} />
              <Spec iconType="parking" label="Vagas" value={String(property.parking)} />
            </div>
            <a
              href={`https://wa.me/5547999837494?text=${encodeURIComponent(
                `Olá! Tenho interesse no imóvel "${property.name}".`,
              )}`}
              className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-gold-classic text-forest-deep px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
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
                <Check className="w-4 h-4 text-gold-classic mt-0.5 shrink-0" />
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
      <IconComponent className="w-5 h-5 text-gold-classic shrink-0" />
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-forest-mid/60">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

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
