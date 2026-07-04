import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import type { Property, PropertyLocation, PropertyType } from "@/data/properties";
import { PROPERTIES as STATIC_PROPERTIES } from "@/data/properties";

const fmt = (n: number) =>
  n === 0
    ? "Sob consulta"
    : `R$ ${Number(n).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;

function rowToProperty(row: Record<string, unknown>): Property {
  const price = Number(row.price ?? 0);
  const features = Array.isArray(row.features) ? (row.features as string[]) : [];
  const images = Array.isArray(row.images) ? (row.images as string[]) : [];
  return {
    code: String(row.code),
    name: String(row.name ?? ""),
    location: String(row.location ?? "") as PropertyLocation,
    neighborhood: String(row.neighborhood ?? ""),
    type: String(row.type ?? "") as PropertyType,
    price,
    priceLabel: fmt(price),
    area: Number(row.area ?? 0),
    bedrooms: Number(row.bedrooms ?? 0),
    suites: Number(row.suites ?? 0),
    parking: Number(row.parking ?? 0),
    description: String(row.description ?? ""),
    features,
    images,
    latitude: row.latitude !== undefined && row.latitude !== null ? Number(row.latitude) : undefined,
    longitude: row.longitude !== undefined && row.longitude !== null ? Number(row.longitude) : undefined,
  };
}

export const listProperties = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      return STATIC_PROPERTIES;
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabasePublic = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    // 1. Tenta buscar da Edge Function "fetch-properties"
    try {
      const { data: edgeData, error: edgeError } = await supabasePublic.functions.invoke("fetch-properties");
      if (!edgeError && Array.isArray(edgeData)) {
        console.log("[listProperties] Imóveis obtidos com sucesso via Edge Function.");
        return edgeData.map((r) => rowToProperty(r as Record<string, unknown>));
      }
      if (edgeError) {
        console.warn("[listProperties] Chamada da Edge Function retornou erro, usando fallback:", edgeError);
      }
    } catch (e) {
      console.warn("[listProperties] Falha ao invocar Edge Function, usando fallback do banco:", e);
    }

    // 2. Fallback para o Banco de Dados
    const { data, error } = await supabasePublic
      .from("properties")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("[listProperties] erro ao buscar no banco de dados:", error);
      return STATIC_PROPERTIES;
    }

    const dbProps = (data ?? []).map((r) => rowToProperty(r as Record<string, unknown>));
    const dbByCode = new Map(dbProps.map((p) => [p.code, p]));

    const merged: Property[] = [
      ...dbProps,
      ...STATIC_PROPERTIES.filter((p) => !dbByCode.has(p.code)),
    ];
    return merged;
  } catch (err) {
    console.error("[listProperties] exceção geral:", err);
    return STATIC_PROPERTIES;
  }
});


export const propertiesQueryOptions = queryOptions({
  queryKey: ["properties"],
  queryFn: () => listProperties(),
  staleTime: 30_000,
});
