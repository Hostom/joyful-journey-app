import { Link, useMatches } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchDailyVerse } from "@/components/fenomeno/DailyVerse";
import type { VerseData } from "@/components/fenomeno/DailyVerse";

type NavbarProps = {
  /** If true, starts transparent and turns solid on scroll (homepage).
   *  If false, always solid (inner pages). */
  transparent?: boolean;
};

function NavbarVerse() {
  const [verse, setVerse] = useState<VerseData | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const cached = localStorage.getItem("navbar_verse_v5");
    const cachedDate = localStorage.getItem("navbar_verse_date_v5");

    if (cached && cachedDate === today) {
      try {
        setVerse(JSON.parse(cached));
        return;
      } catch (e) {
        // ignore
      }
    }

    fetchDailyVerse().then((v) => {
      localStorage.setItem("navbar_verse_v5", JSON.stringify(v));
      localStorage.setItem("navbar_verse_date_v5", today);
      setVerse(v);
    });
  }, []);

  if (!verse) return null;

  return (
    <div className="hidden lg:flex flex-col items-end text-right max-w-[420px] select-none flex-shrink-0 ml-6">
      <p className="text-[11px] italic text-cream-foundation/70 font-sans leading-relaxed break-words">
        "{verse.text}"
      </p>
      <span className="text-[10px] text-gold-classic font-sans font-bold mt-1">
        {verse.reference}
      </span>
    </div>
  );
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  const matches = useMatches();
  useEffect(() => {
    setMobileOpen(false);
  }, [matches]);

  useEffect(() => {
    if (!transparent) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHome = matches.some((m) => m.fullPath === "/");
  const isListings = matches.some((m) => m.fullPath === "/imoveis/");

  const navLinks = [
    { label: "Início", to: "/", hash: undefined, active: isHome && !isListings },
    { label: "Imóveis", to: "/imoveis", hash: undefined, active: isListings },
    { label: "Sobre", to: "/", hash: "about", active: false },
    { label: "Serviços", to: "/", hash: "services", active: false },
    { label: "Contato", to: "/", hash: "contact", active: false },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-forest-deep py-3 shadow-lg shadow-black/20"
            : "bg-forest-deep/80 backdrop-blur-md py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Fenômeno Imóveis" className="h-8 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) =>
              link.hash ? (
                <a
                  key={link.label}
                  href={`/#${link.hash}`}
                  className="text-xs uppercase tracking-[0.2em] text-cream-foundation/80 hover:text-gold-champagne transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-xs uppercase tracking-[0.2em] transition-colors ${
                    link.active
                      ? "text-gold-champagne"
                      : "text-cream-foundation/80 hover:text-gold-champagne"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop CTA replaced by Bible Verse */}
          <NavbarVerse />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-11 h-11 flex items-center justify-center cursor-pointer"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-[1.5px] bg-cream-foundation transition-all duration-300 origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[4.5px]" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-cream-foundation transition-all duration-300 ${
                  mobileOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-cream-foundation transition-all duration-300 origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 md:hidden ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Slide-in panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-forest-deep shadow-2xl transition-transform duration-500 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-24 pb-12 px-8">
            {/* Nav links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <div
                  key={link.label}
                  className={`transition-all duration-500 ${
                    mobileOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: mobileOpen ? `${i * 80 + 150}ms` : "0ms" }}
                >
                  {link.hash ? (
                    <a
                      href={`/#${link.hash}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-lg font-display text-cream-foundation/80 hover:text-gold-champagne transition-colors border-b border-gold-champagne/10"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-4 text-lg font-display transition-colors border-b border-gold-champagne/10 ${
                        link.active
                          ? "text-gold-champagne"
                          : "text-cream-foundation/80 hover:text-gold-champagne"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Bottom section */}
            <div className="mt-auto">
              <div
                className={`transition-all duration-500 ${
                  mobileOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: mobileOpen ? "600ms" : "0ms" }}
              >
                <a
                  href="https://wa.me/5547999837494?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20im%C3%B3veis."
                  onClick={() => setMobileOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-3 bg-gold-classic text-forest-deep px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  Falar no WhatsApp
                </a>

                <div className="mt-8 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold-champagne/60">
                    © 2026 Fenômeno Imóveis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
