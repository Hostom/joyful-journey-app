import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(120),
  email: z.string().trim().email("E-mail inválido").max(255),
  phone: z.string().trim().min(8, "Telefone inválido").max(40),
  message: z.string().trim().max(2000).optional().default(""),
  property_id: z.string().trim().max(120).optional(),
  source: z.string().trim().max(60).optional().default("site"),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.CRM_LEADS_API_URL;
    const token = process.env.CRM_WEBHOOK_TOKEN;

    if (!url || !token) {
      console.error("[submitLead] CRM não configurado", {
        hasUrl: Boolean(url),
        hasToken: Boolean(token),
      });
      return { ok: false as const, error: "CRM não configurado no servidor." };
    }

    const body = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message ?? "",
      ...(data.property_id ? { property_id: data.property_id } : {}),
      source: data.source ?? "site",
      webhook_token: token,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("[submitLead] CRM respondeu com erro", res.status, text);
        return { ok: false as const, error: `CRM retornou ${res.status}.` };
      }

      return { ok: true as const };
    } catch (err) {
      console.error("[submitLead] Falha ao chamar CRM", err);
      return { ok: false as const, error: "Não foi possível contatar o CRM." };
    }
  });
