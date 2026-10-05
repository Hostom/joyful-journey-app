import { useState, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { PROPERTIES } from "@/data/properties";
import { useLeadForm } from "@/lib/useLeadForm";

export function WhatsAppButton() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [openedAt, setOpenedAt] = useState<string>("");

  // Track page change to pre-fill the correct message
  useEffect(() => {
    const pathname = location.pathname;
    const propertyCodeMatch = pathname.match(/\/imoveis\/(\d{5})/);
    const currentProperty = propertyCodeMatch
      ? PROPERTIES.find((p) => p.code === propertyCodeMatch[1])
      : null;

    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.fenomenoimoveis.com.br";

    if (currentProperty) {
      setMessageText(
        `Olá, tenho interesse no imóvel "${currentProperty.name}" (Código: ${currentProperty.code}) - ${origin}/imoveis/${currentProperty.code}. Gostaria de mais informações.`
      );
    } else {
      setMessageText("Olá! Gostaria de receber mais informações sobre a compra e venda de imóveis.");
    }
  }, [location.pathname]);

  // Extract property code for lead registration if on property page
  const pathname = location.pathname;
  const propertyCodeMatch = pathname.match(/\/imoveis\/(\d{5})/);
  const propertyCode = propertyCodeMatch ? propertyCodeMatch[1] : null;
  const isPropertyPage = Boolean(propertyCode);

  const whatsappPhone = "5547999837494";
  const redirectUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(messageText)}`;

  const { name, setName, email, setEmail, phone, setPhone, errors, submitting, serverError, submit, reset } =
    useLeadForm({
      message: messageText,
      propertyId: propertyCode,
      onSuccess: () => {
        setIsOpen(false);
        if (typeof window !== "undefined") {
          window.open(redirectUrl, "_blank", "noopener");
        }
      },
    });

  const handleOpenChat = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setOpenedAt(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    } else {
      reset();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    submit();
  };

  return (
    <>
      {/* Chat Widget Container */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] whatsapp-clickable w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-forest-deep/10 bg-[#efeae2] animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-forest-deep px-4 py-3 flex items-center justify-between text-white border-b border-forest-mid/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-mid flex items-center justify-center text-white border border-gold-champagne/30">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight text-cream-foundation">Fenômeno Imóveis</h3>
                <p className="text-[11px] text-cream-foundation/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block animate-pulse" aria-hidden="true" />
                  Atendimento via WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-cream-foundation/70 hover:text-white transition-colors"
              aria-label="Fechar chat"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Chat Messages Area with Form */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col no-scrollbar max-h-[340px] min-h-[240px]"
            style={{
              backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
              backgroundSize: "contain",
              backgroundColor: "#efeae2",
            }}
          >
            <div className="bg-white rounded-lg p-2.5 shadow-sm text-xs text-gray-800 max-w-[85%] self-start relative rounded-tl-none">
              Olá! 👋
              <span className="block text-[9px] text-gray-400 text-right mt-1">{openedAt}</span>
            </div>

            <div className="bg-white rounded-lg p-2.5 shadow-sm text-xs text-gray-800 max-w-[85%] self-start relative rounded-tl-none">
              {isPropertyPage ? "Quer saber mais sobre este imóvel?" : "Como podemos te ajudar hoje?"}
              <span className="block text-[9px] text-gray-400 text-right mt-1">{openedAt}</span>
            </div>

            <div className="bg-white rounded-lg p-2.5 shadow-sm text-xs text-gray-800 max-w-[85%] self-start relative rounded-tl-none">
              Por favor, informe seus dados para iniciarmos o atendimento no WhatsApp:
              <span className="block text-[9px] text-gray-400 text-right mt-1">{openedAt}</span>
            </div>

            {/* Inline Lead Capture Form */}
            <div className="bg-white rounded-lg p-3.5 shadow-sm text-xs text-gray-800 max-w-[90%] self-start relative rounded-tl-none space-y-3 border border-gray-150">
              <div className="space-y-2.5">
                <div>
                  <label htmlFor="wa-lead-name" className="block text-[10px] text-gray-500 mb-1 uppercase font-medium">Nome completo *</label>
                  <input
                    id="wa-lead-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    disabled={submitting}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "wa-lead-name-error" : undefined}
                    className={`w-full bg-gray-50 border rounded-lg px-2.5 py-1.5 text-xs text-gray-800 placeholder:text-gray-450 outline-none focus:border-emerald-500 transition-colors ${
                      errors.name ? "border-red-400 focus:border-red-500" : "border-gray-250"
                    }`}
                  />
                  {errors.name && <span id="wa-lead-name-error" role="alert" className="text-[10px] text-red-500 mt-0.5 block">{errors.name}</span>}
                </div>

                <div>
                  <label htmlFor="wa-lead-email" className="block text-[10px] text-gray-500 mb-1 uppercase font-medium">E-mail *</label>
                  <input
                    id="wa-lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    disabled={submitting}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "wa-lead-email-error" : undefined}
                    className={`w-full bg-gray-50 border rounded-lg px-2.5 py-1.5 text-xs text-gray-800 placeholder:text-gray-450 outline-none focus:border-emerald-500 transition-colors ${
                      errors.email ? "border-red-400 focus:border-red-500" : "border-gray-250"
                    }`}
                  />
                  {errors.email && <span id="wa-lead-email-error" role="alert" className="text-[10px] text-red-500 mt-0.5 block">{errors.email}</span>}
                </div>

                <div>
                  <label htmlFor="wa-lead-phone" className="block text-[10px] text-gray-500 mb-1 uppercase font-medium">Telefone / WhatsApp *</label>
                  <input
                    id="wa-lead-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 (47) 9983-7494"
                    disabled={submitting}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "wa-lead-phone-error" : undefined}
                    className={`w-full bg-gray-50 border rounded-lg px-2.5 py-1.5 text-xs text-gray-800 placeholder:text-gray-450 outline-none focus:border-emerald-500 transition-colors ${
                      errors.phone ? "border-red-400 focus:border-red-500" : "border-gray-250"
                    }`}
                  />
                  {errors.phone && <span id="wa-lead-phone-error" role="alert" className="text-[10px] text-red-500 mt-0.5 block">{errors.phone}</span>}
                </div>
              </div>

              {serverError && (
                <p role="alert" className="text-[10px] text-red-500 bg-red-50 p-2 border border-red-200 rounded">
                  {serverError}
                </p>
              )}

              {/* Conversar Button */}
              <button
                onClick={() => handleSubmit()}
                disabled={submitting}
                className="w-full bg-[#00a884] hover:bg-[#008f72] disabled:bg-gray-400 text-white flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] mt-3"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {submitting ? "Registrando..." : "Conversar"}
              </button>
            </div>
          </div>

          {/* Footer Input Area */}
          <div className="bg-[#f0f2f5] p-2.5 border-t border-gray-200 flex items-center gap-2">
            <label htmlFor="wa-message" className="sr-only">Mensagem</label>
            <textarea
              id="wa-message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:border-emerald-500 max-h-[70px] min-h-[36px] text-gray-800"
              placeholder="Digite uma mensagem..."
            />
            <button
              onClick={() => handleSubmit()}
              disabled={submitting}
              className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008f72] disabled:bg-gray-400 flex items-center justify-center text-white transition-colors shrink-0 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Enviar mensagem"
            >
              <span className="material-symbols-outlined text-sm leading-none">send</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleOpenChat}
        aria-label="Fale conosco pelo WhatsApp"
        className={`fixed bottom-6 right-6 z-[9999] whatsapp-clickable w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 group hover:scale-110 active:scale-95 ${
          isOpen ? "scale-90" : "scale-100 animate-whatsapp-vibrate"
        }`}
        style={{
          background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
        }}
      >
        {/* Pulse ring (disabled when widget is open) */}
        {!isOpen && <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#25D366]" aria-hidden="true" />}

        {/* WhatsApp or Close icon */}
        {isOpen ? (
          <span className="material-symbols-outlined text-white text-2xl">close</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}

        {/* Tooltip (only when closed) */}
        {!isOpen && (
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-forest-deep text-cream-foundation text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
            Fale conosco
            <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-forest-deep rotate-45" />
          </span>
        )}
      </button>
    </>
  );
}
