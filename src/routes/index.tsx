import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { propertiesQueryOptions } from "@/lib/properties.functions";
import { PropertyCard } from "@/components/fenomeno/PropertyCard";
import { AdvancedFilter } from "@/components/fenomeno/AdvancedFilter";
import { Navbar } from "@/components/fenomeno/Navbar";
import { WhatsAppButton } from "@/components/fenomeno/WhatsAppButton";
import { BackToTop } from "@/components/fenomeno/BackToTop";
import { Footer } from "@/components/fenomeno/Footer";
import { ContactLeadModal } from "@/components/fenomeno/ContactLeadModal";
import { Building2, Handshake, TrendingUp, Headphones, ArrowRight, MessageSquare, Mail } from "lucide-react";
import balnearioAsset from "@/assets/balneario.jpg.asset.json";
import lojaFenomenoAsset from "@/assets/loja-fenomeno.jpg.asset.json";
import lojaFenomenoMobileAsset from "@/assets/loja-fenomeno-mobile.jpg.asset.json";

const REAL_ESTATE_AGENT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Fenômeno Imóveis",
  url: "https://fenomenoimoveis.lovable.app",
  logo: "https://fenomenoimoveis.lovable.app/logo.svg",
  image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
  telephone: "+55 47 9983-7494",
  email: "adm.fenomenoimoveis@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Atlântica, 3230",
    addressLocality: "Balneário Camboriú",
    addressRegion: "SC",
    addressCountry: "BR",
  },
  areaServed: {
    "@type": "City",
    name: "Balneário Camboriú",
  },
  sameAs: [
    "https://www.fenomenoimoveis.com.br",
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fenômeno Imóveis | Luxo em Balneário Camboriú" },
      {
        name: "description",
        content:
          "Imóveis de alto padrão e apartamentos de luxo em Balneário Camboriú. Encontre coberturas exclusivas, imóveis frente mar e oportunidades de investimento.",
      },
      { property: "og:title", content: "Fenômeno Imóveis | Luxo em Balneário Camboriú" },
      {
        property: "og:description",
        content:
          "Imóveis de alto padrão e apartamentos de luxo em Balneário Camboriú. Encontre coberturas exclusivas e imóveis frente mar.",
      },
      { property: "og:url", content: "https://fenomenoimoveis.lovable.app/" },
      { property: "og:site_name", content: "Fenômeno Imóveis" },
      {
        property: "og:image",
        content: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    links: [{ rel: "canonical", href: "https://fenomenoimoveis.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(REAL_ESTATE_AGENT_SCHEMA),
      },
    ],
  }),
  component: Index,
  loader: ({ context }) => context.queryClient.ensureQueryData(propertiesQueryOptions),
});

const HERO_IMG = balnearioAsset.url;

const SERVICES = [
  {
    number: "01",
    Icon: Building2,
    title: "Imóveis Exclusivos",
    body: "Acesso privilegiado e antecipado às melhores coberturas, unidades frente mar e oportunidades off-market.",
    highlight: "Off-Market & Luxo",
  },
  {
    number: "02",
    Icon: Handshake,
    title: "Consultoria Dedicada",
    body: "Assessoria jurídica e comercial especializada para garantir uma transação ágil, transparente e segura.",
    highlight: "Segurança Jurídica",
  },
  {
    number: "03",
    Icon: TrendingUp,
    title: "Inteligência de Mercado",
    body: "Análise profunda de rentabilidade e projeção estratégica de valorização para multiplicar seu patrimônio.",
    highlight: "Alto Retorno",
  },
  {
    number: "04",
    Icon: Headphones,
    title: "Atendimento Concierge",
    body: "Acompanhamento privativo e pós-venda contínuo para total tranquilidade em todas as etapas.",
    highlight: "Experiência VIP",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "A Fenômeno traduziu em um endereço aquilo que eu buscava há anos. Discrição, refinamento e visão de mercado.",
    author: "R. Andrade",
    role: "Investidor — São Paulo",
  },
  {
    quote: "Atendimento absolutamente impecável. Encontraram a cobertura ideal antes mesmo do lançamento oficial.",
    author: "M. Ferreira",
    role: "Empresária — Florianópolis",
  },
];

function Index() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("active");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".reveal-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-cream-foundation text-forest-deep">
      <Navbar transparent />
      <Hero />
      <Properties />
      <About />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      const y = window.scrollY;
      imgRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(1.1)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section id="top" className="relative min-h-screen lg:h-screen lg:min-h-[880px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          ref={imgRef}
          src={HERO_IMG}
          alt="Skyline de Balneário Camboriú"
          className="w-full h-full object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/30 to-forest-deep" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-start pt-24 md:pt-28 lg:pt-28 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="mb-8 w-full">
          <AdvancedFilter
            variant="hero"
            onSubmit={(values) => {
              navigate({
                to: "/imoveis",
                search: values,
              });
            }}
          />
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-gold-champagne mb-6">
          Imóveis de Alto Padrão · Balneário Camboriú
        </p>
        <h1 className="font-display text-cream-foundation text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-5xl">
          Os melhores imóveis de <em className="italic text-gold-champagne">alto padrão</em>
          <br />
          no endereço mais valorizado do Brasil.
        </h1>
        <p className="mt-8 max-w-xl text-cream-foundation/80 text-lg leading-relaxed">
          Compre ou invista em coberturas exclusivas, apartamentos frente mar e oportunidades off-market de alta
          valorização.
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="#properties"
            className="inline-flex items-center gap-3 bg-gold-classic text-forest-deep px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors"
          >
            Explorar Imóveis
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 border border-cream-foundation/30 text-cream-foundation px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-gold-champagne hover:text-gold-champagne transition-colors"
          >
            Falar com um Consultor
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs uppercase tracking-[0.4em] text-gold-classic mb-6 ${className}`}>{children}</p>;
}

function Properties() {
  const { data: ALL_PROPERTIES } = useSuspenseQuery(propertiesQueryOptions);
  const PROPERTIES = ALL_PROPERTIES.slice(0, 3);
  return (
    <section id="properties" className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="reveal-up flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
        <div>
          <SectionLabel>Imóveis em Destaque</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl leading-tight max-w-2xl">
            Apartamentos de alto padrão <em className="italic text-gold-classic">prontos e na planta</em>.
          </h2>
        </div>
        <p className="max-w-md text-forest-mid/80 leading-relaxed">
          Opções selecionadas com alto potencial de valorização, localização privilegiada e acabamento premium para
          moradia ou investimento.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {PROPERTIES.map((p, i) => (
          <PropertyCard key={p.code} property={p} index={i} />
        ))}
      </div>
      <div className="reveal-up mt-16 flex justify-center">
        <Link
          to="/imoveis"
          className="inline-flex items-center gap-3 border border-forest-deep/40 px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-forest-deep hover:text-cream-foundation transition-colors"
        >
          Ver todos os imóveis
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative py-32 bg-forest-deep text-cream-foundation overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16 items-center">
        <div className="reveal-up relative aspect-[4/5] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
            alt="Interior de luxo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="reveal-up">
          <SectionLabel>Sobre a Fenômeno</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl leading-tight mb-8">
            Sua imobiliária de <em className="italic text-gold-champagne">confiança</em> em Balneário Camboriú.
          </h2>
          <p className="text-cream-foundation/80 leading-relaxed mb-6">
            Somos especialistas no mercado de imóveis de alto padrão em Balneário Camboriú. Auxiliamos investidores e
            famílias a realizarem transações seguras, rentáveis e com máxima discrição no mercado mais valorizado do
            país.
          </p>
          <p className="text-cream-foundation/80 leading-relaxed mb-10">
            Parceiros das principais construtoras da região, oferecemos acesso exclusivo a lançamentos, apartamentos
            prontos frente mar e oportunidades que não entram no mercado aberto.
          </p>
          <div className="grid grid-cols-3 gap-6 border-t border-gold-champagne/20 pt-8">
            {[
              ["Curadoria", "Imóveis Selecionados"],
              ["15+ Anos", "Expertise de Mercado"],
              ["100%", "Atendimento Personalizado"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl lg:text-3xl text-gold-champagne">{n}</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-cream-foundation/60 mt-2">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative py-32 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-champagne/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 reveal-up text-center max-w-3xl mx-auto mb-20">
        <SectionLabel>Por Que Escolher a Fenômeno</SectionLabel>
        <h2 className="font-display text-4xl md:text-6xl leading-tight text-forest-deep mb-6">
          Excelência e inteligência imobiliária <em className="italic text-gold-classic">em cada detalhe</em>.
        </h2>
        <p className="text-forest-mid/80 text-base md:text-lg leading-relaxed">
          Oferecemos uma consultoria imobiliária privativa e discreta, desenhada sob medida para proteger e multiplicar seu patrimônio no mercado de alto padrão.
        </p>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((s, i) => {
          const IconComp = s.Icon;
          return (
            <div
              key={s.title}
              className="reveal-up group relative bg-white/80 backdrop-blur-md border border-forest-deep/10 hover:border-gold-classic/40 p-8 lg:p-9 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gold-classic/0 to-transparent group-hover:via-gold-classic/60 transition-all duration-500" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-xl bg-forest-deep/5 group-hover:bg-gold-classic/10 flex items-center justify-center transition-colors duration-300">
                    <IconComp className="text-gold-classic group-hover:scale-110 transition-transform duration-300 w-7 h-7" />
                  </div>
                  <span className="font-display text-3xl text-forest-deep/20 group-hover:text-gold-classic/40 transition-colors duration-300 font-light">
                    {s.number}
                  </span>
                </div>

                <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-classic bg-gold-champagne/15 px-3 py-1 rounded-full mb-4">
                  {s.highlight}
                </span>

                <h3 className="font-display text-xl lg:text-2xl text-forest-deep mb-4 group-hover:text-gold-classic transition-colors">
                  {s.title}
                </h3>

                <p className="text-xs md:text-sm text-forest-mid/75 leading-relaxed">
                  {s.body}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-forest-deep/5 flex items-center justify-between text-xs font-medium text-forest-deep/60 group-hover:text-gold-classic transition-colors">
                <span>Saiba mais</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-32 bg-cream-stone">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="reveal-up mb-20">
          <SectionLabel>Depoimentos</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl leading-tight max-w-3xl">
            Resultados comprovados por quem <em className="italic text-gold-classic">investe e confia</em>.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={t.author}
              className="reveal-up border-l-2 border-gold-classic pl-8"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <p className="font-display italic text-2xl md:text-3xl leading-snug text-forest-deep mb-8">“{t.quote}”</p>
              <footer>
                <div className="font-medium">{t.author}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-forest-mid/60 mt-1">{t.role}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [modal, setModal] = useState<null | "whatsapp" | "email">(null);
  const whatsappUrl = "https://api.whatsapp.com/send?phone=5547999837494";
  const emailUrl = "adm.fenomenoimoveis@gmail.com";

  return (
    <section id="contact" className="relative aspect-[411/1024] md:aspect-auto py-6 md:py-32 bg-forest-deep text-cream-foundation overflow-hidden">
      <div
        className="hidden md:block absolute inset-0 opacity-20 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${lojaFenomenoAsset.url})`,
        }}
      />
      <div
        className="md:hidden absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${lojaFenomenoMobileAsset.url})`,
        }}
      />
      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center flex flex-col justify-center h-full">
        <div className="reveal-up">
          <SectionLabel className="mb-4 md:mb-6">Fale Conosco</SectionLabel>
          <h2 className="font-display text-3xl md:text-7xl leading-tight mb-2 md:mb-8">
            Encontre sua próxima <em className="italic text-gold-champagne">oportunidade de negócio</em>.
          </h2>
          <p className="text-cream-foundation/80 text-sm md:text-lg max-w-2xl mx-auto mb-4 md:mb-12">
            Fale com nossos consultores especialistas. Estamos prontos para apresentar as melhores opções de moradia e
            investimento em Balneário Camboriú.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6 md:mb-16">
            <button
              type="button"
              onClick={() => setModal("whatsapp")}
              className="inline-flex items-center gap-3 bg-gold-classic text-forest-deep px-6 py-3 md:px-10 md:py-5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Falar no WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setModal("email")}
              className="inline-flex items-center gap-3 border border-cream-foundation/30 px-6 py-3 md:px-10 md:py-5 text-xs uppercase tracking-[0.25em] hover:border-gold-champagne hover:text-gold-champagne transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Enviar E-mail
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-12 border-t border-gold-champagne/20 text-left sm:text-center">
            {[
              ["Escritório", "Av. Atlântica, 3230\nBalneário Camboriú · SC"],
              ["Atendimento", "Seg–Sáb · 09h às 20h\nDomingo sob agendamento"],
              ["Contato Direto", "+55 (47) 9983-7494\nadm.fenomenoimoveis@gmail.com"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-gold-champagne mb-3">{k}</div>
                <div className="text-cream-foundation/80 text-xs md:text-sm whitespace-pre-line leading-relaxed">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ContactLeadModal
        open={modal !== null}
        onOpenChange={(o: boolean) => !o && setModal(null)}
        channel={modal ?? "whatsapp"}
        redirectUrl={modal === "email" ? emailUrl : whatsappUrl}
      />
    </section>
  );
}
