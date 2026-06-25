import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// ─── Schemas ────────────────────────────────────────────────────────────────

/**
 * Código do imóvel: string de EXATAMENTE 5 dígitos numéricos (00001–99999).
 * "00000" não é permitido.
 */
const codeSchema = z
  .string({ required_error: "Campo 'code' é obrigatório." })
  .trim()
  .regex(
    /^\d{5}$/,
    "Campo 'code' deve ser uma string numérica de exatamente 5 dígitos (ex.: '00001').",
  )
  .refine((v) => v !== "00000", { message: "Campo 'code' não pode ser '00000'." });

const propertySchema = z.object({
  code: codeSchema,
  name: z.string().trim().min(1, "Campo 'name' obrigatório.").max(200),
  location: z.string().trim().min(1, "Campo 'location' obrigatório.").max(120),
  neighborhood: z.string().trim().max(160).optional().default(""),
  type: z.string().trim().min(1, "Campo 'type' obrigatório.").max(60),
  price: z.coerce.number().min(0).default(0),
  area: z.coerce.number().min(0).default(0),
  bedrooms: z.coerce.number().int().min(0).default(0),
  suites: z.coerce.number().int().min(0).default(0),
  parking: z.coerce.number().int().min(0).default(0),
  description: z.string().max(10000).optional().default(""),
  features: z.array(z.string()).optional().default([]),
  images: z.array(z.string().url("URLs de imagem inválidas em 'images'.")).optional().default([]),
});

const deleteSchema = z.object({ code: codeSchema });

// ─── Helpers ────────────────────────────────────────────────────────────────

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function checkAuth(request: Request): Response | null {
  const expected = process.env.CRM_TO_SITE_BEARER_TOKEN;
  if (!expected) {
    console.error("[properties/sync] CRM_TO_SITE_BEARER_TOKEN não configurado no servidor.");
    return json({ ok: false, error: "Servidor não configurado: CRM_TO_SITE_BEARER_TOKEN ausente." }, 500);
  }
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || token !== expected) {
    console.warn("[properties/sync] Bearer token inválido ou ausente.");
    return json({ ok: false, error: "Authorization Bearer inválido ou ausente." }, 401);
  }
  return null;
}

async function parseBody(request: Request): Promise<unknown> {
  const raw = await request.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("[properties/sync] JSON inválido no body:", err);
    throw new Response(JSON.stringify({ ok: false, error: "JSON inválido no corpo da requisição." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function formatZodIssues(err: z.ZodError) {
  return err.issues.map((i) => ({
    field: i.path.join(".") || "(root)",
    message: i.message,
    code: i.code,
  }));
}

// ─── Route ──────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/api/properties/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFail = checkAuth(request);
        if (authFail) return authFail;

        let body: unknown;
        try {
          body = await parseBody(request);
        } catch (res) {
          return res as Response;
        }

        // Validação explícita do code ANTES do schema completo para erro claro
        const rawCode = (body as { code?: unknown })?.code;
        if (rawCode === undefined || rawCode === null || rawCode === "") {
          console.error("[properties/sync POST] Campo 'code' ausente no payload.", { body });
          return json(
            {
              ok: false,
              error: "Campo 'code' obrigatório (string de 5 dígitos, ex.: '00001').",
              field: "code",
            },
            400,
          );
        }
        if (typeof rawCode !== "string" || !/^\d{5}$/.test(rawCode) || rawCode === "00000") {
          console.error("[properties/sync POST] Formato inválido do 'code':", {
            received: rawCode,
            type: typeof rawCode,
          });
          return json(
            {
              ok: false,
              error: `Formato inválido do 'code': recebido ${JSON.stringify(rawCode)}. Esperado string de 5 dígitos (00001–99999).`,
              field: "code",
            },
            422,
          );
        }

        const parsed = propertySchema.safeParse(body);
        if (!parsed.success) {
          const issues = formatZodIssues(parsed.error);
          console.error("[properties/sync POST] Payload inválido:", issues);
          return json({ ok: false, error: "Payload inválido.", issues }, 422);
        }

        const p = parsed.data;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("properties")
          .upsert(
            {
              code: p.code,
              name: p.name,
              location: p.location,
              neighborhood: p.neighborhood,
              type: p.type,
              price: p.price,
              area: p.area,
              bedrooms: p.bedrooms,
              suites: p.suites,
              parking: p.parking,
              description: p.description,
              features: p.features,
              images: p.images,
            },
            { onConflict: "code" },
          );

        if (error) {
          console.error("[properties/sync POST] Erro ao gravar no banco:", error);
          return json({ ok: false, error: `Erro ao gravar imóvel: ${error.message}` }, 500);
        }

        console.log(`[properties/sync POST] Imóvel ${p.code} sincronizado com sucesso.`);
        return json({ ok: true, code: p.code });
      },

      DELETE: async ({ request }) => {
        const authFail = checkAuth(request);
        if (authFail) return authFail;

        let body: unknown;
        try {
          body = await parseBody(request);
        } catch (res) {
          return res as Response;
        }

        const parsed = deleteSchema.safeParse(body);
        if (!parsed.success) {
          const issues = formatZodIssues(parsed.error);
          console.error("[properties/sync DELETE] Code inválido:", issues);
          return json(
            {
              ok: false,
              error: "Campo 'code' obrigatório (string de 5 dígitos, ex.: '00001').",
              issues,
            },
            422,
          );
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error, count } = await supabaseAdmin
          .from("properties")
          .delete({ count: "exact" })
          .eq("code", parsed.data.code);

        if (error) {
          console.error("[properties/sync DELETE] Erro ao remover do banco:", error);
          return json({ ok: false, error: `Erro ao remover imóvel: ${error.message}` }, 500);
        }

        if (!count) {
          console.warn(`[properties/sync DELETE] Imóvel ${parsed.data.code} não encontrado.`);
          return json({ ok: false, error: `Imóvel ${parsed.data.code} não encontrado.` }, 404);
        }

        console.log(`[properties/sync DELETE] Imóvel ${parsed.data.code} removido.`);
        return json({ ok: true, code: parsed.data.code });
      },
    },
  },
});
