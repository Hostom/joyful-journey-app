import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Mock properties to return as fallback or reference
const FALLBACK_PROPERTIES = [
  {
    code: "00001",
    name: "Yachthouse Residence Club",
    location: "Balneário Camboriú",
    neighborhood: "Barra Sul",
    type: "Apartamento",
    price: 0,
    area: 470,
    bedrooms: 4,
    suites: 4,
    parking: 5,
    latitude: -27.0068,
    longitude: -48.5915,
    description: "Localizado nas torres mais altas residenciais da América Latina, este apartamento oferece vistas panorâmicas do mar e da cidade. Acabamentos italianos e automação completa definem o padrão de excelência.\n\nO empreendimento conta com infraestrutura de resort: spa, piscinas climatizadas, marina privativa e concierge 24 horas.",
    features: [
      "Vista 270° para o mar",
      "4 suítes com closet",
      "Cozinha gourmet Boffi",
      "Automação KNX integrada",
      "5 vagas com carregador EV",
      "Spa e piscina privativos",
      "Marina exclusiva",
      "Concierge 24h"
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    code: "00002",
    name: "Cobertura Iconic Tower",
    location: "Balneário Camboriú",
    neighborhood: "Av. Atlântica · Frente Mar",
    type: "Cobertura",
    price: 38500000,
    area: 820,
    bedrooms: 5,
    suites: 5,
    parking: 6,
    latitude: -26.9880,
    longitude: -48.6250,
    description: "Cobertura duplex frente-mar com piscina privativa em rooftop, deck panorâmico e elevador exclusivo. Cada ambiente foi pensado para receber em alto padrão.\n\nProjeto assinado por escritório premiado, com acabamentos importados e iluminação cênica.",
    features: [
      "Piscina privativa no rooftop",
      "Elevador exclusivo",
      "5 suítes mestre",
      "Adega climatizada",
      "Cinema privativo",
      "Academia equipada",
      "Heliponto no edifício",
      "6 vagas cobertas"
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    code: "00003",
    name: "One Tower Penthouse",
    location: "Balneário Camboriú",
    neighborhood: "Centro · Vista Panorâmica",
    type: "Penthouse",
    price: 22900000,
    area: 510,
    bedrooms: 4,
    suites: 4,
    parking: 4,
    latitude: -27.0040,
    longitude: -48.5950,
    description: "Penthouse de altíssimo padrão no coração da cidade, com vista 360° e living integrado ao terraço aquecido.\n\nAcabamentos em mármore travertino, marcenaria sob medida e sistema de som ambiente em todos os ambientes.",
    features: [
      "Vista 360° panorâmica",
      "Terraço aquecido",
      "Mármore travertino",
      "Marcenaria sob medida",
      "Som ambiente integrado",
      "Cozinha gourmet",
      "Lavabo importado",
      "4 vagas privativas"
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    code: "00004",
    name: "Casa Praia Brava",
    location: "Itajaí",
    neighborhood: "Praia Brava",
    type: "Casa",
    price: 18500000,
    area: 680,
    bedrooms: 5,
    suites: 5,
    parking: 4,
    latitude: -26.9600,
    longitude: -48.6200,
    description: "Casa contemporânea pé-na-areia com projeto biofílico, piscina infinita e SPA privativo. Arquitetura integrada à paisagem.\n\nAmbientes amplos, pé-direito duplo e jardins assinados.",
    features: [
      "Pé na areia",
      "Piscina infinita",
      "SPA privativo",
      "Pé-direito duplo",
      "Jardim paisagístico",
      "Adega climatizada",
      "Home office",
      "Suíte master 90m²"
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fe6ba68?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    code: "00005",
    name: "Residencial Meia Praia",
    location: "Itapema",
    neighborhood: "Meia Praia",
    type: "Apartamento",
    price: 9800000,
    area: 320,
    bedrooms: 4,
    suites: 4,
    parking: 3,
    latitude: -27.1350,
    longitude: -48.6050,
    description: "Apartamento amplo frente-mar em Itapema, com varanda gourmet integrada e vista deslumbrante para a praia.\n\nLazer completo, segurança 24h e acabamentos premium.",
    features: [
      "Frente mar",
      "Varanda gourmet",
      "4 suítes",
      "Lazer completo",
      "Segurança 24h",
      "3 vagas",
      "Depósito privativo",
      "Piscina aquecida"
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  {
    code: "00006",
    name: "Skyline Frente Mar",
    location: "Balneário Camboriú",
    neighborhood: "Av. Atlântica",
    type: "Apartamento",
    price: 14200000,
    area: 390,
    bedrooms: 4,
    suites: 4,
    parking: 4,
    latitude: -26.9930,
    longitude: -48.6220,
    description: "Apartamento de altíssimo padrão em uma das torres mais cobiçadas da Avenida Atlântica.\n\nAcabamentos europeus, automação completa e vista privilegiada para o oceano.",
    features: [
      "Vista mar deslumbrante",
      "Automação completa",
      "Acabamento europeu",
      "Sala estendida",
      "Lavabo em ônix",
      "4 vagas privativas",
      "Adega",
      "Lazer resort"
    ],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=80"
    ]
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const CRM_API_URL = Deno.env.get("CRM_API_URL");
    const CRM_API_KEY = Deno.env.get("CRM_API_KEY");

    if (!CRM_API_URL || !CRM_API_KEY) {
      console.warn("CRM_API_URL ou CRM_API_KEY ausente nos Secrets do Supabase. Retornando dados mockados.");
      return new Response(JSON.stringify(FALLBACK_PROPERTIES), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Buscando imóveis no CRM: ${CRM_API_URL}`);

    // Chamada para a API do CRM externo
    const response = await fetch(CRM_API_URL, {
      method: "GET",
      headers: {
        "x-api-key": CRM_API_KEY,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Erro ao chamar a API do CRM: ${response.status} ${response.statusText}`);
      // Retornar fallback para não quebrar a aplicação frontend em produção caso o CRM externo falhe
      return new Response(JSON.stringify(FALLBACK_PROPERTIES), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    
    // Suporta resposta que seja um array direto ou encapsulada em "properties" ou "data"
    const rawProperties = Array.isArray(data) ? data : (data.properties || data.data || []);

    // Filtrar e repassar apenas os dados estritamente necessários para o frontend
    const cleanProperties = rawProperties.map((p: any) => {
      const address = p.address || p.street || p.rua || p.logradouro ? String(p.address || p.street || p.rua || p.logradouro) : undefined;
      const latVal = p.latitude ?? p.lat;
      const lngVal = p.longitude ?? p.lng ?? p.lon;
      return {
        code: String(p.code || p.id),
        name: String(p.name || p.title || ""),
        location: String(p.location || p.city || p.cidade || ""),
        neighborhood: String(p.neighborhood || p.bairro || ""),
        address,
        type: String(p.type || ""),
        price: Number(p.price || 0),
        area: Number(p.area || p.area_total || 0),
        bedrooms: Number(p.bedrooms || 0),
        suites: Number(p.suites || 0),
        parking: Number(p.parking || p.parking_spots || p.vagas || 0),
        description: String(p.description || ""),
        features: Array.isArray(p.features) ? p.features : [],
        images: Array.isArray(p.images) ? p.images : (Array.isArray(p.photos) ? p.photos : []),
        latitude: latVal !== undefined && latVal !== null && !isNaN(Number(latVal)) ? Number(latVal) : undefined,
        longitude: lngVal !== undefined && lngVal !== null && !isNaN(Number(lngVal)) ? Number(lngVal) : undefined,
      };
    });

    return new Response(JSON.stringify(cleanProperties), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Exceção na Edge Function fetch-properties:", error);
    // Retornar os dados mockados em caso de erro crítico de processamento
    return new Response(JSON.stringify(FALLBACK_PROPERTIES), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
