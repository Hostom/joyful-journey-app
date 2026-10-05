import { cloneElement, useEffect, useId } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLeadForm } from "@/lib/useLeadForm";

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

export function ContactLeadModal({ open, onOpenChange, channel, redirectUrl, defaultMessage = "", propertyId }: Props) {
  const formId = useId();

  const baseMessage =
    defaultMessage || "Olá! Vim pelo site da Fenômeno Imóveis e gostaria de mais informações.";

  const { name, setName, email, setEmail, phone, setPhone, errors, submitting, serverError, submit, reset } =
    useLeadForm({
      message: baseMessage,
      propertyId,
      onSuccess: () => {
        onOpenChange(false);
        if (typeof window !== "undefined") {
          window.open(redirectUrl, channel === "email" ? "_self" : "_blank", "noopener");
        }
      },
    });

  useEffect(() => {
    if (!open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
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
          <DialogTitle className="font-display text-2xl text-cream-foundation">{title}</DialogTitle>
          <DialogDescription className="text-cream-foundation/70 text-sm">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4" noValidate>
          <Field id={`${formId}-name`} label="Nome completo" error={errors.name}>
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

          <Field id={`${formId}-email`} label="E-mail" error={errors.email}>
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

          <Field id={`${formId}-phone`} label="Telefone / WhatsApp" error={errors.phone}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              maxLength={40}
              className={inputClass(Boolean(errors.phone))}
              placeholder="+55 (47) 9983-7494"
            />
          </Field>

          {serverError && (
            <p role="alert" className="text-xs text-red-300 bg-red-500/10 border border-red-400/30 rounded px-3 py-2">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-gold-classic text-forest-deep px-6 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gold-champagne transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">{channel === "whatsapp" ? "chat" : "mail"}</span>
            {submitting ? "Enviando..." : channel === "whatsapp" ? "Continuar no WhatsApp" : "Continuar por E-mail"}
          </button>

          <p className="text-[11px] text-cream-foundation/70 text-center leading-relaxed">
            Ao continuar, seus dados serão enviados para nossa equipe comercial.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}) {
  const errorId = `${id}-error`;
  return (
    <label className="block" htmlFor={id}>
      <span className="block text-[11px] uppercase tracking-[0.18em] text-cream-foundation/60 mb-2">{label}</span>
      {cloneElement(children, {
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <span id={errorId} role="alert" className="block mt-1 text-xs text-red-300">
          {error}
        </span>
      )}
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
