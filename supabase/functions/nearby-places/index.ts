import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function mapCategoriesToGoogleTypes(categories: string[]): string[] {
  const mapping: Record<string, string[]> = {
    escola: ["school", "primary_school", "secondary_school"],
    mercado: ["supermarket", "grocery_store", "department_store"],
    farmacia: ["pharmacy", "drugstore"],
    academia: ["gym", "sports_club"],
  };

  const googleTypes: string[] = [];
  for (const cat of categories) {
    const normalizedCat = cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const mapped = mapping[normalizedCat] || mapping[cat] || [];
    googleTypes.push(...mapped);
  }

  return googleTypes.length > 0 ? googleTypes : ["establishment"];
}

function emptyResponse() {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Cache in-memory por instância (TTL 24h, max 200 entradas)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX = 200;
const cache = new Map<string, { at: number; data: unknown }>();

function cacheKey(lat: number, lng: number, cats: string[]): string {
  const r = (n: number) => Math.round(n * 10000) / 10000;
  return `${r(lat)}:${r(lng)}:${[...cats].sort().join(",")}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const { latitude, longitude, categories = ["escola", "mercado", "farmacia", "academia"] } = await req.json();

    if (latitude === undefined || longitude === undefined) {
      return new Response(JSON.stringify({ error: "Parâmetros 'latitude' e 'longitude' são obrigatórios." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!GOOGLE_PLACES_API_KEY) {
      console.warn("GOOGLE_PLACES_API_KEY não configurada — retornando lista vazia.");
      return emptyResponse();
    }

    const centerLat = Number(latitude);
    const centerLng = Number(longitude);
    const key = cacheKey(centerLat, centerLng, categories);
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
      return new Response(JSON.stringify(hit.data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "HIT" },
      });
    }

    const googleTypes = mapCategoriesToGoogleTypes(categories);

    const url = "https://places.googleapis.com/v1/places:searchNearby";
    const body = {
      includedTypes: googleTypes,
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: centerLat, longitude: centerLng },
          radius: 1500.0,
        },
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.location,places.primaryType,places.types",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("Google Places API falhou:", response.status, errText);
      return emptyResponse();
    }

    const result = await response.json();
    const rawPlaces = result.places || [];

    const cleanPlaces = rawPlaces
      .map((place: any) => {
        const placeLat = place.location?.latitude;
        const placeLng = place.location?.longitude;
        const name = place.displayName?.text;
        if (!name || placeLat === undefined || placeLng === undefined) return null;

        const distance = Math.round(haversineDistance(centerLat, centerLng, placeLat, placeLng));
        const allTypes = place.types || [];
        let matchedCategory = "outros";

        if (allTypes.some((t: string) => ["school", "primary_school", "secondary_school", "university", "school_district"].includes(t))) {
          matchedCategory = "escola";
        } else if (allTypes.some((t: string) => ["supermarket", "grocery_store", "convenience_store", "department_store"].includes(t))) {
          matchedCategory = "mercado";
        } else if (allTypes.some((t: string) => ["pharmacy", "drugstore"].includes(t))) {
          matchedCategory = "farmacia";
        } else if (allTypes.some((t: string) => ["gym", "sports_club", "amusement_center", "athletic_field"].includes(t))) {
          matchedCategory = "academia";
        }

        return {
          name,
          type: matchedCategory,
          distance,
          coordinates: { latitude: placeLat, longitude: placeLng },
        };
      })
      .filter((p: any) => p !== null);

    cleanPlaces.sort((a: any, b: any) => a.distance - b.distance);

    if (cache.size >= CACHE_MAX) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) cache.delete(oldestKey);
    }
    cache.set(key, { at: Date.now(), data: cleanPlaces });

    return new Response(JSON.stringify(cleanPlaces), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("Exceção na Edge Function nearby-places:", error);
    return emptyResponse();
  }
});
