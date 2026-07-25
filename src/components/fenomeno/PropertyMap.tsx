import { useEffect, useRef, useState } from "react";
import { getGoogleMapsKey } from "@/lib/maps.functions";


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

// Global script loading state
let isScriptLoading = false;
let scriptLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  isScriptLoading = true;
  scriptLoadPromise = new Promise((resolve, reject) => {
    // Define the global callback function
    (window as any).initGoogleMapCallback = () => {
      isScriptLoading = false;
      resolve();
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMapCallback&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onerror = (err) => {
      isScriptLoading = false;
      scriptLoadPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

// Premium subtle map styling suitable for luxury real estate (warm grey/gold tones)
const luxuryMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "on" }, { saturation: -100 }, { lightness: 20 }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#e0e6ed" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
];

export function PropertyMap({ latitude, longitude, propertyName, nearbyPlaces = [], height }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [googleApiKey, setGoogleApiKey] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    // Direct client check fallback
    const clientKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "";

    getGoogleMapsKey()
      .then((res) => {
        if (cancelled) return;
        const key = res?.key || clientKey;
        if (!key) {
          console.warn("GOOGLE_MAPS_API_KEY não está configurada.");
          setLoadError(true);
          return;
        }
        setGoogleApiKey(key);
      })
      .catch((err) => {
        if (cancelled) return;
        if (clientKey) {
          setGoogleApiKey(clientKey);
        } else {
          console.error("Erro ao obter GOOGLE_MAPS_API_KEY:", err);
          setLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!googleApiKey) return;
    loadGoogleMapsScript(googleApiKey)
      .then(() => {
        setMapLoaded(true);
      })
      .catch((err) => {
        console.error("Erro ao carregar Google Maps script:", err);
        setLoadError(true);
      });
  }, [googleApiKey]);

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google?.maps) return;

    // Reset previous markers if any
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const mapOptions: google.maps.MapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
      styles: luxuryMapStyle,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    };

    const map = new google.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    // Re-trigger resize after modal dialog finishes rendering
    const timer = setTimeout(() => {
      if (mapInstanceRef.current && window.google?.maps) {
        google.maps.event.trigger(mapInstanceRef.current, "resize");
        mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
      }
    }, 200);

    // Create Main Property Marker (Dourado de Luxo)
    const propertyMarker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: propertyName,
      icon: {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: "#C5A880", // Gold classic
        fillOpacity: 1.0,
        strokeColor: "#1A3020", // Forest deep
        strokeWeight: 1.5,
        scale: 2,
        anchor: new google.maps.Point(12, 21),
      },
      zIndex: 999, // Highlight property above all other places
    });

    propertyMarker.addListener("click", () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(`
          <div style="font-family: sans-serif; padding: 6px 12px; color: #1A3020;">
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${propertyName}</h4>
            <p style="margin: 0; font-size: 11px; color: #C5A880; text-transform: uppercase; font-weight: 600; letter-spacing: 0.1em;">Imóvel Selecionado</p>
          </div>
        `);
        infoWindowRef.current.open(map, propertyMarker);
      }
    });

    markersRef.current.push(propertyMarker);

    return () => {
      clearTimeout(timer);
    };
  }, [mapLoaded, latitude, longitude, propertyName]);

  // Update/Plot Nearby Places Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !window.google?.maps) return;

    // Clear previous nearby markers (keeping only the main property marker which is at index 0)
    const [propertyMarker, ...oldNearbyMarkers] = markersRef.current;
    oldNearbyMarkers.forEach((m) => m.setMap(null));
    markersRef.current = propertyMarker ? [propertyMarker] : [];

    if (nearbyPlaces.length === 0) return;

    // Helper for category-specific colors and symbols
    const getCategoryMarkerOptions = (type: string) => {
      switch (type) {
        case "escola":
          return {
            color: "#3B82F6", // Blue
            symbol: "school",
          };
        case "mercado":
          return {
            color: "#10B981", // Green
            symbol: "shopping_cart",
          };
        case "farmacia":
          return {
            color: "#EF4444", // Red
            symbol: "medical_services",
          };
        case "academia":
          return {
            color: "#8B5CF6", // Purple
            symbol: "fitness_center",
          };
        default:
          return {
            color: "#6B7280", // Grey
            symbol: "place",
          };
      }
    };

    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: latitude, lng: longitude });

    // Plot each nearby place
    nearbyPlaces.forEach((place) => {
      const opts = getCategoryMarkerOptions(place.type);

      const marker = new google.maps.Marker({
        position: { lat: place.coordinates.latitude, lng: place.coordinates.longitude },
        map: map,
        title: place.name,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
          fillColor: opts.color,
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 1.0,
          scale: 1.5,
          anchor: new google.maps.Point(12, 21),
        },
      });

      const distanceLabel = place.distance >= 1000 ? `${(place.distance / 1000).toFixed(1)} km` : `${place.distance} m`;

      const typeLabel = place.type.charAt(0).toUpperCase() + place.type.slice(1);

      marker.addListener("click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="font-family: sans-serif; padding: 6px 12px; color: #1A3020; min-width: 140px;">
              <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700;">${place.name}</h4>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 11px;">
                <span style="color: #6B7280; font-weight: 500;">${typeLabel}</span>
                <span style="color: #C5A880; font-weight: 700; background: #FAF7F2; padding: 2px 6px; border-radius: 4px;">${distanceLabel}</span>
              </div>
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
      bounds.extend({ lat: place.coordinates.latitude, lng: place.coordinates.longitude });
    });

    // Fit map bounds to show all markers
    map.fitBounds(bounds);

    // Set a maximum zoom level so we don't zoom in too close if there's only 1 marker nearby
    google.maps.event.addListenerOnce(map, "bounds_changed", () => {
      if (map.getZoom()! > 16) {
        map.setZoom(16);
      }
    });
  }, [nearbyPlaces, mapLoaded, latitude, longitude]);

  if (loadError) {
    return (
      <div className="w-full h-80 bg-stone-100 rounded-lg flex flex-col items-center justify-center border border-stone-200 text-stone-500 font-sans p-6 text-center">
        <span className="material-symbols-outlined text-4xl mb-3 text-stone-400">map</span>
        <h4 className="font-semibold text-stone-700 mb-1">Mapa Indisponível</h4>
        <p className="text-xs text-stone-500 max-w-sm">
          A chave do Google Maps não está configurada no momento. Por favor, configure a variável{" "}
          <code>GOOGLE_MAPS_API_KEY</code> para exibir o mapa dinâmico.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-gold-champagne/15 shadow-inner">
      <div ref={mapRef} style={{ height: height || "280px" }} className="w-full bg-stone-100" />

      {/* Map legend */}
      {nearbyPlaces.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded shadow-md border border-stone-100 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-700 font-sans font-medium">
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
