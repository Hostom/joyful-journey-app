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
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
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

/**
 * Geocodifica um endereço usando a Google Geocoding API.
 * Fallback progressivo: "name, neighborhood, location, Brasil" →
 * "neighborhood, location, Brasil" → "location, Brasil".
 * Retorna null se falhar em todas as tentativas.
 */
async function geocodeAddress(parts: {
  name?: string;
  neighborhood?: string;
  location: string;
}): Promise<{ latitude: number; longitude: number } | null> {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn("[properties/sync] Nenhuma chave de Geocoding configurada — pulando geocoding.");
    return null;
  }

  const attempts = [
    [parts.name, parts.neighborhood, parts.location, "Brasil"].filter(Boolean).join(", "),
    [parts.neighborhood, parts.location, "Brasil"].filter(Boolean).join(", "),
    [parts.location, "Brasil"].filter(Boolean).join(", "),
  ].filter((q, i, a) => q.length > 0 && a.indexOf(q) === i);

  for (const address of attempts) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&region=br&key=${apiKey}`;
      const res = await fetch(url);
      const data = (await res.json()) as {
        status: string;
        results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }>;
        error_message?: string;
      };
      if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log(`[properties/sync] Geocode OK "${address}" → ${lat},${lng}`);
        return { latitude: lat, longitude: lng };
      }
      if (data.status !== "ZERO_RESULTS") {
        console.warn(
          `[properties/sync] Geocode "${address}" status=${data.status} msg=${data.error_message ?? "-"}`,
        );
      }
    } catch (err) {
      console.error(`[properties/sync] Erro geocode "${address}":`, err);
    }
  }
  console.warn("[properties/sync] Geocode falhou para todas as variações:", attempts);
  return null;
}

// ─── Route ──────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/api/public/properties/sync")({
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

        // Se o CRM não enviou coords válidas, geocodifica a partir do endereço.
        let latitude = p.latitude;
        let longitude = p.longitude;
        if (
          typeof latitude !== "number" ||
          typeof longitude !== "number" ||
          isNaN(latitude) ||
          isNaN(longitude)
        ) {
          const geo = await geocodeAddress({
            name: p.name,
            neighborhood: p.neighborhood,
            location: p.location,
          });
          if (geo) {
            latitude = geo.latitude;
            longitude = geo.longitude;
          } else {
            latitude = undefined;
            longitude = undefined;
          }
        }

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
              latitude,
              longitude,
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
