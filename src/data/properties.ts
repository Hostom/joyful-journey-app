export type PropertyLocation = "Balneário Camboriú" | "Itapema" | "Itajaí";
export type PropertyType = "Apartamento" | "Cobertura" | "Penthouse" | "Casa";

/**
 * Código único do imóvel — string de exatamente 5 dígitos numéricos
 * ("00001" a "99999"). Usado como identificador nas URLs (/imoveis/:code)
 * e como chave de sincronização com o CRM.
 */
export type PropertyCode = string;

export type Property = {
  code: PropertyCode;
  name: string;
  location: PropertyLocation;
  neighborhood: string;
  address?: string;
  type: PropertyType;
  price: number;
  priceLabel: string;
  area: number;
  bedrooms: number;
  suites: number;
  parking: number;
  description: string;
  features: string[];
  images: string[];
  latitude?: number;
  longitude?: number;
  /** Marcado pelo CRM: indica se o imóvel deve aparecer nos destaques da home por região. */
  featured?: boolean;
};

const fmt = (n: number) =>
  n === 0
    ? "Sob consulta"
    : `R$ ${n.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;

const make = (
  p: Omit<Property, "priceLabel">,
): Property => ({ ...p, priceLabel: fmt(p.price) });

/** Valida se um código tem exatamente 5 dígitos numéricos (00001–99999). */
export const isValidPropertyCode = (code: string): boolean =>
  /^\d{5}$/.test(code) && code !== "00000";

export const PROPERTIES: Property[] = [
  make({
    code: "00001",
    name: "Yachthouse Residence Club",
    location: "Balneário Camboriú",
    neighborhood: "Barra Sul",
    featured: true,
    type: "Apartamento",
    price: 0,
    area: 470,
    bedrooms: 4,
    suites: 4,
    parking: 5,
    latitude: -27.0068,
    longitude: -48.5915,
    description:
      "Localizado nas torres mais altas residenciais da América Latina, este apartamento oferece vistas panorâmicas do mar e da cidade. Acabamentos italianos e automação completa definem o padrão de excelência.\n\nO empreendimento conta com infraestrutura de resort: spa, piscinas climatizadas, marina privativa e concierge 24 horas.",
    features: [
      "Vista 270° para o mar",
      "4 suítes com closet",
      "Cozinha gourmet Boffi",
      "Automação KNX integrada",
      "5 vagas com carregador EV",
      "Spa e piscina privativos",
      "Marina exclusiva",
      "Concierge 24h",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    ],
  }),
  make({
    code: "00002",
    name: "Cobertura Iconic Tower",
    location: "Balneário Camboriú",
    neighborhood: "Av. Atlântica · Frente Mar",
    featured: true,
    type: "Cobertura",
    price: 38500000,
    area: 820,
    bedrooms: 5,
    suites: 5,
    parking: 6,
    latitude: -26.9880,
    longitude: -48.6250,
    description:
      "Cobertura duplex frente-mar com piscina privativa em rooftop, deck panorâmico e elevador exclusivo. Cada ambiente foi pensado para receber em alto padrão.\n\nProjeto assinado por escritório premiado, com acabamentos importados e iluminação cênica.",
    features: [
      "Piscina privativa no rooftop",
      "Elevador exclusivo",
      "5 suítes mestre",
      "Adega climatizada",
      "Cinema privativo",
      "Academia equipada",
      "Heliponto no edifício",
      "6 vagas cobertas",
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1600&q=80",
    ],
  }),
  make({
    code: "00003",
    name: "One Tower Penthouse",
    location: "Balneário Camboriú",
    neighborhood: "Centro · Vista Panorâmica",
    featured: true,
    type: "Penthouse",
    price: 22900000,
    area: 510,
    bedrooms: 4,
    suites: 4,
    parking: 4,
    latitude: -27.0040,
    longitude: -48.5950,
    description:
      "Penthouse de altíssimo padrão no coração da cidade, com vista 360° e living integrado ao terraço aquecido.\n\nAcabamentos em mármore travertino, marcenaria sob medida e sistema de som ambiente em todos os ambientes.",
    features: [
      "Vista 360° panorâmica",
      "Terraço aquecido",
      "Mármore travertino",
      "Marcenaria sob medida",
      "Som ambiente integrado",
      "Cozinha gourmet",
      "Lavabo importado",
      "4 vagas privativas",
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1600&q=80",
    ],
  }),
  make({
    code: "00004",
    name: "Casa Praia Brava",
    location: "Itajaí",
    neighborhood: "Praia Brava",
    featured: true,
    type: "Casa",
    price: 18500000,
    area: 680,
    bedrooms: 5,
    suites: 5,
    parking: 4,
    latitude: -26.9600,
    longitude: -48.6200,
    description:
      "Casa contemporânea pé-na-areia com projeto biofílico, piscina infinita e SPA privativo. Arquitetura integrada à paisagem.\n\nAmbientes amplos, pé-direito duplo e jardins assinados.",
    features: [
      "Pé na areia",
      "Piscina infinita",
      "SPA privativo",
      "Pé-direito duplo",
      "Jardim paisagístico",
      "Adega climatizada",
      "Home office",
      "Suíte master 90m²",
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fe6ba68?auto=format&fit=crop&w=1600&q=80",
    ],
  }),
  make({
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
    description:
      "Apartamento amplo frente-mar em Itapema, com varanda gourmet integrada e vista deslumbrante para a praia.\n\nLazer completo, segurança 24h e acabamentos premium.",
    features: [
      "Frente mar",
      "Varanda gourmet",
      "4 suítes",
      "Lazer completo",
      "Segurança 24h",
      "3 vagas",
      "Depósito privativo",
      "Piscina aquecida",
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
    ],
  }),
  make({
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
    description:
      "Apartamento de altíssimo padrão em uma das torres mais cobiçadas da Avenida Atlântica.\n\nAcabamentos europeus, automação completa e vista privilegiada para o oceano.",
    features: [
      "Vista mar deslumbrante",
      "Automação completa",
      "Acabamento europeu",
      "Sala estendida",
      "Lavabo em ônix",
      "4 vagas privativas",
      "Adega",
      "Lazer resort",
    ],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=80",
    ],
  }),
];

export const LOCATIONS: PropertyLocation[] = [
  "Balneário Camboriú",
  "Itapema",
  "Itajaí",
];
export const TYPES: PropertyType[] = [
  "Apartamento",
  "Cobertura",
  "Penthouse",
  "Casa",
];

export const findProperty = (code: string) =>
  PROPERTIES.find((p) => p.code === code);
