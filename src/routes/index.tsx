import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PROPERTIES as ALL_PROPERTIES } from "@/data/properties";
import { PropertyCard } from "@/components/fenomeno/PropertyCard";
import { AdvancedFilter } from "@/components/fenomeno/AdvancedFilter";
import { Navbar } from "@/components/fenomeno/Navbar";
import { WhatsAppButton } from "@/components/fenomeno/WhatsAppButton";
import { BackToTop } from "@/components/fenomeno/BackToTop";
import { Footer } from "@/components/fenomeno/Footer";
import { ContactLeadModal } from "@/components/fenomeno/ContactLeadModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fenômeno Imóveis | Apartamentos de Luxo em Balneário Camboriú" },
      {
        name: "description",
        content:
          "Imóveis de alto padrão e apartamentos de luxo em Balneário Camboriú. Encontre coberturas exclusivas, imóveis frente mar e oportunidades de investimento.",
      },
      { property: "og:title", content: "Fenômeno Imóveis | Apartamentos de Luxo em Balneário Camboriú" },
      {
        property: "og:description",
        content:
          "Imóveis de alto padrão e apartamentos de luxo em Balneário Camboriú. Encontre coberturas exclusivas e imóveis frente mar.",
      },
      { property: "og:url", content: "/" },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const HERO_IMG =
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=2000&q=80";

const PROPERTIES = ALL_PROPERTIES.slice(0, 3);


const SERVICES = [
  {
    icon: "real_estate_agent",
    title: "Imóveis Exclusivos",
    body: "Acesso antecipado a lançamentos de alto padrão e oportunidades fora do mercado convencional.",
  },
  {
    icon: "handshake",
    title: "Consultoria Imobiliária",
    body: "Apoio jurídica e comercial especializado para garantir uma compra segura e sem burocracia.",
  },
  {
    icon: "trending_up",
    title: "Retorno sobre Investimento",
    body: "Análise detalhada de rentabilidade e projeção de valorização para multiplicar seu patrimônio.",
  },
  {
    icon: "support_agent",
    title: "Suporte Pós-Venda",
    body: "Acompanhamento contínuo após o fechamento do negócio para sua total tranquilidade.",
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
    quote:
      "Atendimento absolutamente impecável. Encontraram a cobertura ideal antes mesmo do lançamento oficial.",
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

/* Nav is now the shared <Navbar /> component */

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
          Compre ou invista em coberturas exclusivas, apartamentos frente mar e oportunidades off-market de alta valorização.
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="#properties"
            className="inline-flex items-center gap-3 bg-gold-classic text-forest-deep px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors"
          >
            Explorar Imóveis
            <span className="material-symbols-outlined text-base">arrow_forward</span>
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.4em] text-gold-classic mb-6">
      {children}
    </p>
  );
}

function Properties() {
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
          Opções selecionadas com alto potencial de valorização, localização privilegiada e acabamento premium para moradia ou investimento.
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
          <span className="material-symbols-outlined text-base">arrow_forward</span>
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
            Sua imobiliária de <em className="italic text-gold-champagne">confiança</em> em
            Balneário Camboriú.
          </h2>
          <p className="text-cream-foundation/80 leading-relaxed mb-6">
            Somos especialistas no mercado de imóveis de alto padrão em Balneário Camboriú. Auxiliamos investidores e famílias a realizarem transações seguras, rentáveis e com máxima discrição no mercado mais valorizado do país.
          </p>
          <p className="text-cream-foundation/80 leading-relaxed mb-10">
            Parceiros das principais construtoras da região, oferecemos acesso exclusivo a lançamentos, apartamentos prontos frente mar e oportunidades que não entram no mercado aberto.
          </p>
          <div className="grid grid-cols-3 gap-6 border-t border-gold-champagne/20 pt-8">
            {[
              ["+R$ 2,8 bi", "VGV Negociado"],
              ["15 anos", "Experiência"],
              ["320+", "Clientes Satisfeitos"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl text-gold-champagne">{n}</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-cream-foundation/60 mt-2">
                  {l}
                </div>
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
    <section id="services" className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="reveal-up text-center max-w-2xl mx-auto mb-20">
        <SectionLabel>Nossos Serviços</SectionLabel>
        <h2 className="font-display text-5xl md:text-6xl leading-tight">
          Consultoria completa para <em className="italic text-gold-classic">comprar e investir</em>.
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-forest-deep/10">
        {SERVICES.map((s, i) => (
          <div
            key={s.title}
            className="reveal-up bg-cream-foundation p-10 hover:bg-cream-stone transition-colors"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <span className="material-symbols-outlined text-gold-classic mb-8" style={{ fontSize: 36 }}>
              {s.icon}
            </span>
            <h3 className="font-display text-2xl mb-4">{s.title}</h3>
            <p className="text-sm text-forest-mid/70 leading-relaxed">{s.body}</p>
          </div>
        ))}
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
              <p className="font-display italic text-2xl md:text-3xl leading-snug text-forest-deep mb-8">
                “{t.quote}”
              </p>
              <footer>
                <div className="font-medium">{t.author}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-forest-mid/60 mt-1">
                  {t.role}
                </div>
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
  const whatsappUrl = "https://wa.me/5547999999999";
  const emailUrl = "mailto:contato@fenomenoimoveis.com.br";

  return (
    <section
      id="contact"
      className="relative py-32 bg-forest-deep text-cream-foundation overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&w=2000&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <div className="reveal-up">
          <SectionLabel>Fale Conosco</SectionLabel>
          <h2 className="font-display text-5xl md:text-7xl leading-tight mb-8">
            Encontre sua próxima <em className="italic text-gold-champagne">oportunidade de negócio</em>.
          </h2>
          <p className="text-cream-foundation/80 text-lg max-w-2xl mx-auto mb-12">
            Fale com nossos consultores especialistas. Estamos prontos para apresentar as melhores opções de moradia e investimento em Balneário Camboriú.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button
              type="button"
              onClick={() => setModal("whatsapp")}
              className="inline-flex items-center gap-3 bg-gold-classic text-forest-deep px-10 py-5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Falar no WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setModal("email")}
              className="inline-flex items-center gap-3 border border-cream-foundation/30 px-10 py-5 text-xs uppercase tracking-[0.25em] hover:border-gold-champagne hover:text-gold-champagne transition-colors"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              Enviar E-mail
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 pt-12 border-t border-gold-champagne/20 text-left sm:text-center">
            {[
              ["Escritório", "Av. Atlântica, 1500\nBalneário Camboriú · SC"],
              ["Atendimento", "Seg–Sáb · 09h às 20h\nDomingo sob agendamento"],
              ["Contato Direto", "+55 (47) 99999-9999\ncontato@fenomenoimoveis.com.br"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[11px] uppercase tracking-[0.25em] text-gold-champagne mb-3">
                  {k}
                </div>
                <div className="text-cream-foundation/80 text-sm whitespace-pre-line leading-relaxed">
                  {v}
                </div>
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


/* Footer is now the shared <Footer /> component */
