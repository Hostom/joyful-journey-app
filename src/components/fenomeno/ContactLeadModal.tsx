import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { submitLead } from "@/lib/crm.functions";

export type ContactChannel = "whatsapp" | "email";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: ContactChannel;
  /** Destination after lead capture. WhatsApp URL or mailto: URL. */
  redirectUrl: string;
  /** Optional default message to forward to WhatsApp/E-mail. */
  defaultMessage?: string;
  /** Optional property id to attach to the lead. */
  propertyId?: string;
};

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

export function ContactLeadModal({
  open,
  onOpenChange,
  channel,
  redirectUrl,
  defaultMessage = "",
  propertyId,
}: Props) {
  const send = useServerFn(submitLead);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setErrors({});
      setServerError(null);
      setSubmitting(false);
    }
  }, [open]);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "E-mail inválido.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) next.phone = "Telefone inválido.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const baseMessage =
        defaultMessage ||
        (channel === "whatsapp"
          ? "Olá! Vim pelo site da Fenômeno Imóveis e gostaria de mais informações."
          : "Olá! Vim pelo site da Fenômeno Imóveis e gostaria de mais informações.");

      const result = await send({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: baseMessage,
          ...(propertyId ? { property_id: propertyId } : {}),
          source: "site",
        },
      });

      if (!result.ok) {
        setServerError(result.error || "Não foi possível enviar agora.");
        setSubmitting(false);
        return;
      }

      onOpenChange(false);
      if (typeof window !== "undefined") {
        window.open(redirectUrl, channel === "email" ? "_self" : "_blank", "noopener");
      }
    } catch (err) {
      console.error(err);
      setServerError("Erro inesperado. Tente novamente.");
      setSubmitting(false);
    }
  };

  const title = channel === "whatsapp" ? "Falar no WhatsApp" : "Enviar e-mail";
  const description =
    channel === "whatsapp"
      ? "Preencha seus dados para iniciarmos a conversa no WhatsApp."
      : "Preencha seus dados e abriremos o seu e-mail com a mensagem.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-forest-deep border-gold-champagne/20 text-cream-foundation sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-cream-foundation">
            {title}
          </DialogTitle>
          <DialogDescription className="text-cream-foundation/70 text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4" noValidate>
          <Field label="Nome completo" error={errors.name}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={120}
              className={inputClass(Boolean(errors.name))}
              placeholder="Seu nome"
            />
          </Field>

          <Field label="E-mail" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={255}
              className={inputClass(Boolean(errors.email))}
              placeholder="voce@exemplo.com"
            />
          </Field>

          <Field label="Telefone / WhatsApp" error={errors.phone}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              maxLength={40}
              className={inputClass(Boolean(errors.phone))}
              placeholder="+55 (47) 9983-7494
            />
          </Field>

          {serverError && (
            <p className="text-xs text-red-300 bg-red-500/10 border border-red-400/30 rounded px-3 py-2">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-gold-classic text-forest-deep px-6 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">
              {channel === "whatsapp" ? "chat" : "mail"}
            </span>
            {submitting ? "Enviando..." : channel === "whatsapp" ? "Continuar no WhatsApp" : "Continuar por E-mail"}
          </button>

          <p className="text-[11px] text-cream-foundation/50 text-center leading-relaxed">
            Ao continuar, seus dados serão enviados para nossa equipe comercial.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-cream-foundation/60 mb-2">
        {label}
      </span>
      {children}
      {error && <span className="block mt-1 text-xs text-red-300">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full bg-white/5 border rounded px-3 py-2.5 text-sm text-cream-foundation placeholder:text-cream-foundation/30",
    "outline-none focus:border-gold-champagne transition-colors",
    hasError ? "border-red-400/60" : "border-cream-foundation/15",
  ].join(" ");
}
