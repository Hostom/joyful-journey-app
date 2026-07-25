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

function generateMockPlaces(lat: number, lng: number, categoryList: string[]) {
  const isBrava = lat > -26.970 && lat < -26.930;
  const isItapema = lat < -27.05;

  const realPlacesDB: Record<string, { name: string; lat: number; lng: number }[]> = {
    escola: isBrava
      ? [
          { name: "Univali Campus Praia Brava", lat: -26.9550, lng: -48.6230 },
          { name: "Escola Internacional de Itajaí", lat: -26.9480, lng: -48.6290 },
          { name: "Colégio Salesiano Itajaí", lat: -26.9120, lng: -48.6600 },
        ]
      : isItapema
      ? [
          { name: "Colégio Única Meia Praia", lat: -27.1320, lng: -48.6040 },
          { name: "Escola Básica Educar", lat: -27.1410, lng: -48.6120 },
        ]
      : [
          { name: "Colégio Visão Balneário", lat: -26.9890, lng: -48.6280 },
          { name: "Colégio Energia BC", lat: -26.9850, lng: -48.6320 },
          { name: "Universidade Univali BC", lat: -26.9820, lng: -48.6390 },
          { name: "Escola Municipal Ivone Teresinha", lat: -27.0010, lng: -48.5980 },
        ],
    mercado: isBrava
      ? [
          { name: "Deville Supermercado Brava", lat: -26.9580, lng: -48.6210 },
          { name: "Brava Mall Gourmet Market", lat: -26.9540, lng: -48.6240 },
          { name: "Supermercado Koch Itajaí", lat: -26.9350, lng: -48.6400 },
        ]
      : isItapema
      ? [
          { name: "Koch Supermercados Meia Praia", lat: -27.1350, lng: -48.6060 },
          { name: "Super Koch Express 24h", lat: -27.1400, lng: -48.6100 },
          { name: "Meschke Supermercado Itapema", lat: -27.1280, lng: -48.6020 },
        ]
      : [
          { name: "Supermercado Angeloni (Av. do Estado)", lat: -26.9780, lng: -48.6360 },
          { name: "Meschke Supermercado (Av. Brasil)", lat: -26.9920, lng: -48.6260 },
          { name: "Koch Supermercados (Barra Sul)", lat: -27.0040, lng: -48.5940 },
          { name: "Bistek Supermercados BC", lat: -26.9840, lng: -48.6330 },
          { name: "Fort Atacadista Balneário", lat: -26.9710, lng: -48.6420 },
        ],
    farmacia: isBrava
      ? [
          { name: "Panvel Farmácias Brava Mall", lat: -26.9545, lng: -48.6242 },
          { name: "Droga Raia Praia Brava", lat: -26.9590, lng: -48.6205 },
          { name: "Farmácia Catarinense Brava", lat: -26.9520, lng: -48.6270 },
        ]
      : isItapema
      ? [
          { name: "Farmácia São João Meia Praia", lat: -27.1360, lng: -48.6050 },
          { name: "Panvel Farmácias Itapema", lat: -27.1310, lng: -48.6030 },
          { name: "Droga Raia Meia Praia", lat: -27.1420, lng: -48.6090 },
        ]
      : [
          { name: "Droga Raia (Av. Atlântica)", lat: -26.9940, lng: -48.6240 },
          { name: "Panvel Farmácias (Barra Sul)", lat: -27.0030, lng: -48.5950 },
          { name: "Farmácia Catarinense (Av. Brasil)", lat: -26.9880, lng: -48.6270 },
          { name: "Drogaria São João (Centro BC)", lat: -26.9860, lng: -48.6310 },
          { name: "Farmácia Preço Popular Pioneiros", lat: -26.9730, lng: -48.6370 },
        ],
    academia: isBrava
      ? [
          { name: "Ironberg Gym Brava", lat: -26.9560, lng: -48.6225 },
          { name: "Wave Fitness Brava", lat: -26.9510, lng: -48.6260 },
          { name: "CrossFit Brava Beach", lat: -26.9610, lng: -48.6190 },
        ]
      : isItapema
      ? [
          { name: "Smart Fit Meia Praia", lat: -27.1370, lng: -48.6045 },
          { name: "Academia Top Fitness Itapema", lat: -27.1300, lng: -48.6020 },
          { name: "Platinum Gym Meia Praia", lat: -27.1430, lng: -48.6080 },
        ]
      : [
          { name: "Smart Fit (Barra Sul BC)", lat: -27.0020, lng: -48.5960 },
          { name: "Academia Wave (Av. Atlântica)", lat: -26.9910, lng: -48.6250 },
          { name: "BodyTech Balneário Camboriú", lat: -26.9870, lng: -48.6300 },
          { name: "Alliance Jiu-Jitsu & Gym", lat: -26.9830, lng: -48.6350 },
        ],
  };

  const results: any[] = [];
  categoryList.forEach((cat) => {
    const list = realPlacesDB[cat] || [];
    list.forEach((item) => {
      const dist = Math.round(haversineDistance(lat, lng, item.lat, item.lng));
      results.push({
        name: item.name,
        type: cat,
        distance: dist,
        coordinates: { latitude: item.lat, longitude: item.lng },
      });
    });
  });

  return results.sort((a, b) => a.distance - b.distance);
}

function mapCategoriesToGoogleTypes(categories: string[]): string[] {
  const mapping: Record<string, string[]> = {
    escola: ["school", "primary_school", "secondary_school"],
    mercado: ["supermarket", "grocery_store", "department_store"],
    farmacia: ["pharmacy", "drugstore"],
    academia: ["gym", "sports_club"]
  };

  const googleTypes: string[] = [];
  for (const cat of categories) {
    const normalizedCat = cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const mapped = mapping[normalizedCat] || mapping[cat] || [];
    googleTypes.push(...mapped);
  }

  return googleTypes.length > 0 ? googleTypes : ["establishment"];
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
      const mockResult = generateMockPlaces(Number(latitude), Number(longitude), categories);
      return new Response(JSON.stringify(mockResult), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const googleTypes = mapCategoriesToGoogleTypes(categories);
    const centerLat = Number(latitude);
    const centerLng = Number(longitude);

    const url = "https://places.googleapis.com/v1/places:searchNearby";
    const body = {
      includedTypes: googleTypes,
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: centerLat,
            longitude: centerLng
          },
          radius: 1500.0
        }
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.location,places.primaryType,places.types"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const mockResult = generateMockPlaces(centerLat, centerLng, categories);
      return new Response(JSON.stringify(mockResult), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const rawPlaces = result.places || [];

    const cleanPlaces = rawPlaces.map((place: any) => {
      const placeLat = place.location?.latitude;
      const placeLng = place.location?.longitude;
      const name = place.displayName?.text || "Estabelecimento";
      
      const distance = (placeLat !== undefined && placeLng !== undefined)
        ? Math.round(haversineDistance(centerLat, centerLng, placeLat, placeLng))
        : 0;

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
        coordinates: {
          latitude: placeLat,
          longitude: placeLng
        }
      };
    });

    const filteredPlaces = cleanPlaces.filter(
      (p: any) => p.coordinates.latitude !== undefined && p.coordinates.longitude !== undefined
    );

    filteredPlaces.sort((a: any, b: any) => a.distance - b.distance);

    return new Response(JSON.stringify(filteredPlaces), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Exceção na Edge Function nearby-places:", error);
    try {
      const requestBody = await req.json().catch(() => ({}));
      const fallbackLat = requestBody.latitude !== undefined ? Number(requestBody.latitude) : -27.0068;
      const fallbackLng = requestBody.longitude !== undefined ? Number(requestBody.longitude) : -48.5915;
      const fallbackCats = requestBody.categories || ["escola", "mercado", "farmacia", "academia"];
      const mockResult = generateMockPlaces(fallbackLat, fallbackLng, fallbackCats);
      return new Response(JSON.stringify(mockResult), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Erro interno no servidor." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
});
