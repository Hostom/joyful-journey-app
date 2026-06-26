import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-forest-deep text-cream-foundation/60 border-t border-gold-champagne/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <img src="/logo.svg" alt="Fenômeno Imóveis" className="h-8 w-auto" />
            <div className="hidden sm:block w-px h-6 bg-gold-champagne/20" />
            <p className="text-xs italic text-cream-foundation/50 max-w-sm leading-relaxed font-sans">
              "Assim brilhe a luz de vocês diante dos homens, para que vejam as suas boas obras e glorifiquem ao Pai de
              vocês, que está nos céus"{" "}
              <span className="text-gold-champagne/70 font-semibold not-italic ml-1"> Mateus 5:16</span>
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed">
            Especialistas em imóveis de alto padrão e investimentos imobiliários em Balneário Camboriú. Compre com
            segurança e rentabilidade.
          </p>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-gold-champagne mb-4">Navegação</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-gold-champagne transition-colors">
                Início
              </Link>
            </li>
            <li>
              <Link to="/imoveis" className="hover:text-gold-champagne transition-colors">
                Imóveis
              </Link>
            </li>
            <li>
              <a href="/#about" className="hover:text-gold-champagne transition-colors">
                Sobre
              </a>
            </li>
            <li>
              <a href="/#services" className="hover:text-gold-champagne transition-colors">
                Serviços
              </a>
            </li>
            <li>
              <a href="/#contact" className="hover:text-gold-champagne transition-colors">
                Contato
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-gold-champagne mb-4">Redes</div>
          <div className="flex gap-3 mb-8">
            {[
              { icon: "public", label: "Site", href: "#" },
              { icon: "share", label: "Social", href: "#" },
              { icon: "mail", label: "Email", href: "mailto:contato@fenomenoimoveis.com.br" },
            ].map((item) => (
              <a
                key={item.icon}
                href={item.href}
                aria-label={item.label}
                className="w-10 h-10 border border-gold-champagne/30 flex items-center justify-center text-gold-classic hover:bg-gold-classic hover:text-forest-deep transition-all"
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
              </a>
            ))}
          </div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-gold-champagne mb-3">Contato</div>
          <div className="text-sm space-y-1">
            <p>+55 (47) 9983-7494</p>
            <p>contato@fenomenoimoveis.com.br</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 border-t border-gold-champagne/10 text-center text-[11px] uppercase tracking-[0.25em] text-cream-foundation/40">
        © 2026 Fenômeno Imóveis · Todos os direitos reservados
      </div>
    </footer>
  );
}
