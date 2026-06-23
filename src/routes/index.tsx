import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PROPERTIES as ALL_PROPERTIES } from "@/data/properties";
import { PropertyCard } from "@/components/fenomeno/PropertyCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fenômeno Imóveis | Luxo em Balneário Camboriú" },
      {
        name: "description",
        content:
          "Imóveis de altíssimo padrão em Balneário Camboriú. Coberturas, apartamentos e residências exclusivas no destino mais luxuoso do Brasil.",
      },
      { property: "og:title", content: "Fenômeno Imóveis | Luxo em Balneário Camboriú" },
      {
        property: "og:description",
        content:
          "Imóveis de altíssimo padrão em Balneário Camboriú. Coberturas e residências exclusivas.",
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
    icon: "diamond",
    title: "Curadoria Exclusiva",
    body: "Seleção criteriosa de imóveis off-market para clientes de altíssimo padrão.",
  },
  {
    icon: "handshake",
    title: "Assessoria Privada",
    body: "Acompanhamento personalizado em cada etapa, do primeiro contato à entrega das chaves.",
  },
  {
    icon: "public",
    title: "Investimentos Globais",
    body: "Estruturação de aquisições para investidores nacionais e internacionais.",
  },
  {
    icon: "design_services",
    title: "Arquitetura & Interiores",
    body: "Parcerias com escritórios premiados para entregas chave-na-mão sob medida.",
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <Nav scrolled={scrolled} />
      <Hero />
      <Properties />
      <About />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

function Nav({ scrolled }: { scrolled: boolean }) {
  const links = [
    ["Imóveis", "#properties"],
    ["Sobre", "#about"],
    ["Serviços", "#services"],
    ["Contato", "#contact"],
  ];
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-forest-deep py-3 shadow-lg shadow-black/20"
          : "bg-forest-deep/80 backdrop-blur-md py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-wide text-cream-foundation">
            Fenômeno
          </span>
          <span className="font-display italic text-sm text-gold-champagne">imóveis</span>
        </a>
        <nav className="hidden md:flex items-center gap-10">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-xs uppercase tracking-[0.2em] text-cream-foundation/80 hover:text-gold-champagne transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 border border-gold-champagne/60 text-gold-champagne px-5 py-2 text-xs uppercase tracking-[0.2em] hover:bg-gold-champagne hover:text-forest-deep transition-all"
        >
          Atendimento Privado
        </a>
      </div>
    </header>
  );
}

function Hero() {
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
    <section id="top" className="relative h-[100vh] min-h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          ref={imgRef}
          src={HERO_IMG}
          alt="Skyline de Balneário Camboriú"
          className="w-full h-full object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/30 to-forest-deep" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-champagne mb-6">
          Coleção 2026 · Balneário Camboriú
        </p>
        <h1 className="font-display text-cream-foundation text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-5xl">
          O cume do <em className="italic text-gold-champagne">luxo</em>
          <br />
          começa no endereço certo.
        </h1>
        <p className="mt-8 max-w-xl text-cream-foundation/80 text-lg leading-relaxed">
          Coberturas, residências e oportunidades off-market no destino mais
          desejado do litoral brasileiro.
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="#properties"
            className="inline-flex items-center gap-3 bg-gold-classic text-forest-deep px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors"
          >
            Explorar Portfólio
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 border border-cream-foundation/30 text-cream-foundation px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-gold-champagne hover:text-gold-champagne transition-colors"
          >
            Agendar Visita Privada
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
          <SectionLabel>Portfólio Selecionado</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl leading-tight max-w-2xl">
            Residências que <em className="italic text-gold-classic">definem</em> a paisagem.
          </h2>
        </div>
        <p className="max-w-md text-forest-mid/80 leading-relaxed">
          Cada imóvel da nossa curadoria é avaliado por critérios de localização,
          arquitetura, vista e potencial de valorização.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {PROPERTIES.map((p, i) => (
          <article
            key={p.name}
            className="reveal-up group"
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="relative overflow-hidden mb-6 aspect-[4/5]">
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-cream-foundation/95 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-forest-deep">
                Exclusivo
              </div>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-display text-2xl">{p.name}</h3>
              <span className="text-xs uppercase tracking-widest text-gold-classic">
                {p.sqm}
              </span>
            </div>
            <p className="text-sm text-forest-mid/70 mb-4">{p.location}</p>
            <div className="flex items-center justify-between pt-4 border-t border-forest-deep/10">
              <span className="font-medium">{p.price}</span>
              <a
                href="#contact"
                className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-forest-deep hover:text-gold-classic transition-colors"
              >
                Detalhes
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </article>
        ))}
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
          <SectionLabel>Nossa Filosofia</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl leading-tight mb-8">
            Um <em className="italic text-gold-champagne">fenômeno</em> chamado
            Balneário.
          </h2>
          <p className="text-cream-foundation/80 leading-relaxed mb-6">
            Balneário Camboriú é o epicentro do novo luxo brasileiro. Nossa
            atuação nasceu para acompanhar quem reconhece o valor desse momento
            histórico — com sigilo, sofisticação e profundo conhecimento de
            mercado.
          </p>
          <p className="text-cream-foundation/80 leading-relaxed mb-10">
            Trabalhamos com as principais incorporadoras da cidade e mantemos
            relacionamentos diretos com proprietários, oferecendo acesso a
            oportunidades que não circulam publicamente.
          </p>
          <div className="grid grid-cols-3 gap-6 border-t border-gold-champagne/20 pt-8">
            {[
              ["+R$ 2,8 bi", "Em VGV negociado"],
              ["15 anos", "De atuação local"],
              ["320+", "Famílias atendidas"],
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
        <SectionLabel>Serviços</SectionLabel>
        <h2 className="font-display text-5xl md:text-6xl leading-tight">
          Uma experiência <em className="italic text-gold-classic">imersiva</em>{" "}
          de ponta a ponta.
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
          <SectionLabel>Confiança</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl leading-tight max-w-3xl">
            Reconhecidos por quem busca o <em className="italic text-gold-classic">excepcional</em>.
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
          <SectionLabel>Atendimento Privado</SectionLabel>
          <h2 className="font-display text-5xl md:text-7xl leading-tight mb-8">
            Vamos conversar sobre o seu <em className="italic text-gold-champagne">próximo endereço</em>.
          </h2>
          <p className="text-cream-foundation/80 text-lg max-w-2xl mx-auto mb-12">
            Nossa equipe atende com discrição absoluta. Agende uma conversa
            privada para conhecer oportunidades sob medida.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a
              href="https://wa.me/5547999999999"
              className="inline-flex items-center gap-3 bg-gold-classic text-forest-deep px-10 py-5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              WhatsApp Concierge
            </a>
            <a
              href="mailto:contato@fenomenoimoveis.com.br"
              className="inline-flex items-center gap-3 border border-cream-foundation/30 px-10 py-5 text-xs uppercase tracking-[0.25em] hover:border-gold-champagne hover:text-gold-champagne transition-colors"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              Enviar Mensagem
            </a>
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
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-forest-deep text-cream-foundation/60 border-t border-gold-champagne/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-display text-2xl text-cream-foundation">Fenômeno</span>
            <span className="font-display italic text-sm text-gold-champagne">imóveis</span>
          </div>
          <p className="max-w-md text-sm leading-relaxed">
            O ápice do mercado imobiliário em Balneário Camboriú. Curadoria,
            assessoria e investimentos de altíssimo padrão.
          </p>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-gold-champagne mb-4">
            Navegação
          </div>
          <ul className="space-y-2 text-sm">
            <li><a href="#properties" className="hover:text-gold-champagne">Imóveis</a></li>
            <li><a href="#about" className="hover:text-gold-champagne">Sobre</a></li>
            <li><a href="#services" className="hover:text-gold-champagne">Serviços</a></li>
            <li><a href="#contact" className="hover:text-gold-champagne">Contato</a></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-gold-champagne mb-4">
            Redes
          </div>
          <div className="flex gap-3">
            {["public", "share", "mail"].map((i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 border border-gold-champagne/30 flex items-center justify-center text-gold-classic hover:bg-gold-classic hover:text-forest-deep transition-all"
              >
                <span className="material-symbols-outlined text-base">{i}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 border-t border-gold-champagne/10 text-center text-[11px] uppercase tracking-[0.25em] text-cream-foundation/40">
        © 2026 Fenômeno Imóveis · Todos os direitos reservados
      </div>
    </footer>
  );
}
