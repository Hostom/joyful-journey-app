import { useEffect, useRef, useState } from "react";

interface NearbyPlace {
  name: string;
  type: string;
  distance: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  propertyName: string;
  nearbyPlaces?: NearbyPlace[];
  height?: string;
}

let leafletLoadPromise: Promise<void> | null = null;

function loadLeafletScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).L) return Promise.resolve();
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    // Inject Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Inject Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;

    script.onload = () => resolve();
    script.onerror = (err) => {
      leafletLoadPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return leafletLoadPromise;
}

export function PropertyMap({ latitude, longitude, propertyName, nearbyPlaces = [], height }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadLeafletScript()
      .then(() => setMapLoaded(true))
      .catch((err) => {
        console.error("Erro ao carregar Leaflet:", err);
        setLoadError(true);
      });
  }, []);

  // Helper para ícones de marcadores Leaflet
  const createCustomIcon = (color: string, iconSymbol: string, isMain = false) => {
    const L = (window as any).L;
    if (!L) return null;
    const size = isMain ? 34 : 26;
    const html = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid ${isMain ? "#1A3020" : "#ffffff"};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      ">
        <span class="material-symbols-outlined" style="
          transform: rotate(45deg);
          color: ${isMain ? "#1A3020" : "#ffffff"};
          font-size: ${isMain ? 18 : 14}px;
          line-height: 1;
        ">${iconSymbol}</span>
      </div>
    `;
    return L.divIcon({
      className: "custom-leaflet-pin",
      html,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  };

  // Inicializa o Mapa Leaflet com tiles luxuosos CARTO Positron
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !(window as any).L) return;
    const L = (window as any).L;

    // Destrói instância anterior se existir
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    // CARTO Positron Light map style (luxuoso, limpo, cinza claro)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    mapInstanceRef.current = map;

    // Garante que o mapa redesenhe corretamente dentro de modais/dialogs
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    // Marcador do Imóvel Principal (Dourado de Luxo)
    const mainIcon = createCustomIcon("#C5A880", "home", true);
    const mainMarker = L.marker([latitude, longitude], { icon: mainIcon }).addTo(map);
    mainMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px 8px; color: #1A3020;">
        <h4 style="margin: 0 0 2px 0; font-size: 13px; font-weight: 700; color: #1A3020;">${propertyName}</h4>
        <p style="margin: 0; font-size: 10px; color: #C5A880; text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em;">Imóvel Selecionado</p>
      </div>
    `);

    markersRef.current = [mainMarker];

    return () => {
      clearTimeout(timer);
    };
  }, [mapLoaded, latitude, longitude, propertyName]);

  // Atualiza Marcadores de Comércios Próximos
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (!map || !mapLoaded || !L) return;

    // Limpa marcadores anteriores (mantendo apenas o principal)
    const [mainMarker, ...oldNearby] = markersRef.current;
    oldNearby.forEach((m) => map.removeLayer(m));
    markersRef.current = mainMarker ? [mainMarker] : [];

    if (nearbyPlaces.length === 0) return;

    const bounds = L.latLngBounds([[latitude, longitude]]);

    const getCategoryConfig = (type: string) => {
      switch (type) {
        case "escola":
          return { color: "#3B82F6", icon: "school" };
        case "mercado":
          return { color: "#10B981", icon: "shopping_cart" };
        case "farmacia":
          return { color: "#EF4444", icon: "medical_services" };
        case "academia":
          return { color: "#8B5CF6", icon: "fitness_center" };
        default:
          return { color: "#6B7280", icon: "place" };
      }
    };

    nearbyPlaces.forEach((place) => {
      const cfg = getCategoryConfig(place.type);
      const icon = createCustomIcon(cfg.color, cfg.icon, false);
      const pos: [number, number] = [place.coordinates.latitude, place.coordinates.longitude];

      const marker = L.marker(pos, { icon }).addTo(map);
      const distStr = place.distance >= 1000 ? `${(place.distance / 1000).toFixed(1)} km` : `${place.distance} m`;
      const typeLabel = place.type.charAt(0).toUpperCase() + place.type.slice(1);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px 8px; color: #1A3020; min-width: 130px;">
          <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700;">${place.name}</h4>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px;">
            <span style="color: #6B7280;">${typeLabel}</span>
            <span style="color: #C5A880; font-weight: 700; background: #FAF7F2; padding: 2px 4px; border-radius: 3px;">${distStr}</span>
          </div>
        </div>
      `);

      markersRef.current.push(marker);
      bounds.extend(pos);
    });

    map.fitBounds(bounds, { padding: [35, 35], maxZoom: 16 });
  }, [nearbyPlaces, mapLoaded, latitude, longitude]);

  if (loadError) {
    return (
      <div className="w-full h-80 bg-stone-100 rounded-lg flex flex-col items-center justify-center border border-stone-200 text-stone-500 font-sans p-6 text-center">
        <span className="material-symbols-outlined text-4xl mb-3 text-stone-400">map</span>
        <h4 className="font-semibold text-stone-700 mb-1">Mapa Indisponível</h4>
        <p className="text-xs text-stone-500 max-w-sm">Não foi possível carregar o mapa interativo no momento.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-gold-champagne/15 shadow-inner z-0">
      <div ref={mapRef} style={{ height: height || "280px" }} className="w-full bg-stone-100 z-0" />

      {/* Legenda do Mapa */}
      {nearbyPlaces.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-md border border-stone-200 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-stone-700 font-sans font-medium z-[1000]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#C5A880" }} />
            <span>Imóvel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#3B82F6" }} />
            <span>Escolas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#10B981" }} />
            <span>Mercados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#EF4444" }} />
            <span>Farmácias</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#8B5CF6" }} />
            <span>Academias</span>
          </div>
        </div>
      )}
    </div>
  );
}
