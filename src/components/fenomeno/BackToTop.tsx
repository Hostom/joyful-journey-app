import { useEffect, useState } from "react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo"
      className={`fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-forest-deep/80 backdrop-blur-md border border-gold-champagne/30 text-gold-champagne flex items-center justify-center shadow-lg hover:bg-forest-deep hover:border-gold-classic transition-all duration-500 cursor-pointer ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <span className="material-symbols-outlined text-lg">arrow_upward</span>
    </button>
  );
}
