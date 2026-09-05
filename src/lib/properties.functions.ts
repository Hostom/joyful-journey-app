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

  const address =
    row.address || row.street || row.rua || row.logradouro
      ? String(row.address || row.street || row.rua || row.logradouro)
      : undefined;

  const latRaw = row.latitude ?? row.lat;
  const lngRaw = row.longitude ?? row.lng ?? row.lon;

  const latitude =
    latRaw !== undefined && latRaw !== null && !isNaN(Number(latRaw))
      ? Number(latRaw)
      : undefined;

  const longitude =
    lngRaw !== undefined && lngRaw !== null && !isNaN(Number(lngRaw))
      ? Number(lngRaw)
      : undefined;

  return {
    code: String(row.code),
    name: String(row.name ?? ""),
    location: String(row.location ?? row.city ?? "") as PropertyLocation,
    neighborhood: String(row.neighborhood ?? row.bairro ?? ""),
    address,
    type: String(row.type ?? "") as PropertyType,
    price,
    priceLabel: fmt(price),
    area: Number(row.area ?? row.area_total ?? 0),
    bedrooms: Number(row.bedrooms ?? 0),
    suites: Number(row.suites ?? 0),
    parking: Number(row.parking ?? row.vagas ?? 0),
    description: String(row.description ?? ""),
    features,
    images,
    latitude,
    longitude,
    featured: Boolean(row.featured ?? row.destaque ?? false),
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

    // Fonte de verdade: banco de dados (populado pelo webhook do CRM em /api/public/properties/sync).
    const { data, error } = await supabasePublic
      .from("properties")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("[listProperties] erro ao buscar no banco de dados:", error);
      return STATIC_PROPERTIES;
    }

    const dbProps = (data ?? []).map((r) => rowToProperty(r as Record<string, unknown>));
    if (dbProps.length === 0) {
      // Banco vazio: mantém os mocks estáticos para não quebrar a vitrine.
      return STATIC_PROPERTIES;
    }
    return dbProps;
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
