import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/crm.functions";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export type LeadFormErrors = Partial<Record<"name" | "email" | "phone", string>>;

type UseLeadFormOptions = {
  message: string;
  propertyId?: string | null;
  onSuccess?: () => void;
};

function trackLeadSubmitted() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "lead_enviado_crm" });
}

/** Shared name/email/phone validation and CRM submission used by every lead-capture form on the site. */
export function useLeadForm({ message, propertyId, onSuccess }: UseLeadFormOptions) {
  const send = useServerFn(submitLead);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: LeadFormErrors = {};
    if (!name.trim()) next.name = "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "E-mail inválido.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) next.phone = "Telefone inválido.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setErrors({});
    setServerError(null);
    setSubmitting(false);
  };

  const submit = async () => {
    if (!validate() || submitting) return false;
    setSubmitting(true);
    setServerError(null);

    try {
      const result = await send({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message,
          ...(propertyId ? { property_id: propertyId } : {}),
          source: "site",
        },
      });

      if (!result.ok) {
        setServerError(result.error || "Não foi possível enviar agora.");
        setSubmitting(false);
        return false;
      }

      trackLeadSubmitted();
      setSubmitting(false);
      onSuccess?.();
      return true;
    } catch (err) {
      console.error(err);
      setServerError("Erro inesperado. Tente novamente.");
      setSubmitting(false);
      return false;
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    errors,
    submitting,
    serverError,
    submit,
    reset,
  };
}
