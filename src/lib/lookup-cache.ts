// Cache leve com TTL em sessionStorage para reduzir chamadas repetidas
// a APIs de geocoding e locais próximos durante a navegação do usuário.

type Entry<T> = { v: T; e: number };

const isBrowser = typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

export function cacheGet<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Entry<T>;
    if (!parsed || typeof parsed.e !== "number") return null;
    if (Date.now() > parsed.e) {
      window.sessionStorage.removeItem(key);
      return null;
    }
    return parsed.v;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  if (!isBrowser) return;
  try {
    const entry: Entry<T> = { v: value, e: Date.now() + ttlMs };
    window.sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // quota exceeded / privacy mode — silently ignore
  }
}

// Arredonda coordenadas para ~11m de precisão (4 casas decimais)
// para que pequenas variações do mesmo imóvel bata na mesma chave.
export function roundCoord(n: number, decimals = 4): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

export function nearbyCacheKey(lat: number, lng: number, categories: string[]): string {
  const cats = [...categories].sort().join(",");
  return `np:${roundCoord(lat)}:${roundCoord(lng)}:${cats}`;
}

export function geocodeCacheKey(query: string): string {
  return `geo:${query.trim().toLowerCase()}`;
}

export const NEARBY_TTL_MS = 24 * 60 * 60 * 1000; // 24h
export const GEOCODE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7d
