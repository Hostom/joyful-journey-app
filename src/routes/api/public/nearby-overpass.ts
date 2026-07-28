import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const bodySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().int().min(100).max(5000).optional(),
  categories: z.array(z.enum(["escola", "mercado", "farmacia", "academia"])).optional(),
});

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi = ((lat2 - lat1) * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function classify(tags: Record<string, string> | undefined): string | null {
  if (!tags) return null;
  if (tags.amenity === "school" || tags.amenity === "college" || tags.amenity === "university")
    return "escola";
  if (tags.shop === "supermarket" || tags.shop === "convenience" || tags.shop === "grocery")
    return "mercado";
  if (tags.amenity === "pharmacy") return "farmacia";
  if (
    tags.leisure === "fitness_centre" ||
    tags.sport === "fitness" ||
    tags.leisure === "sports_centre"
  )
    return "academia";
  return null;
}

function empty() {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function callOverpass(query: string): Promise<any | null> {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "data=" + encodeURIComponent(query),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) continue;
      return await res.json();
    } catch (err) {
      console.warn("[nearby-overpass] endpoint falhou:", endpoint, err);
      continue;
    }
  }
  return null;
}

export const Route = createFileRoute("/api/public/nearby-overpass")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return new Response(JSON.stringify({ error: "Invalid body" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { latitude, longitude } = parsed;
        const radius = parsed.radius ?? 1600;
        const cats = parsed.categories ?? ["escola", "mercado", "farmacia", "academia"];

        const query = `
          [out:json][timeout:8];
          (
            node["amenity"="school"](around:${radius},${latitude},${longitude});
            node["shop"="supermarket"](around:${radius},${latitude},${longitude});
            node["shop"="convenience"](around:${radius},${latitude},${longitude});
            node["shop"="grocery"](around:${radius},${latitude},${longitude});
            node["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
            node["leisure"="fitness_centre"](around:${radius},${latitude},${longitude});
            node["sport"="fitness"](around:${radius},${latitude},${longitude});
          );
          out body 40;
        `;

        const data = await callOverpass(query);
        if (!data || !Array.isArray(data.elements)) return empty();

        const places = data.elements
          .map((el: any) => {
            const name = el.tags?.name;
            const pLat = el.lat;
            const pLng = el.lon;
            if (!name || typeof pLat !== "number" || typeof pLng !== "number") return null;
            const type = classify(el.tags);
            if (!type || !cats.includes(type)) return null;
            return {
              name,
              type,
              distance: Math.round(haversine(latitude, longitude, pLat, pLng)),
              coordinates: { latitude: pLat, longitude: pLng },
            };
          })
          .filter((p: any) => p !== null)
          .sort((a: any, b: any) => a.distance - b.distance)
          .slice(0, 20);

        return new Response(JSON.stringify(places), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      },
    },
  },
});
