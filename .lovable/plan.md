## Objetivo

Criar um endpoint próprio (server route TanStack) que faça proxy da Overpass API, evitando CORS/rate-limit no browser e centralizando a lógica no backend do site. Ele complementa a função `nearby-places` (Google) — quando o Google devolver vazio, o front consulta o proxy Overpass em vez de bater direto no `overpass-api.de` do navegador.

## Mudanças

1. **Novo `src/routes/api/public/nearby-overpass.ts`** (server route pública):
   - `POST { latitude, longitude, radius? }` com validação Zod.
   - Monta a query Overpass (escolas, mercados/conveniência, farmácias, academias) no servidor.
   - Faz `fetch` para `https://overpass-api.de/api/interpreter` (com fallback para `https://overpass.kumi.systems/api/interpreter` se o primeiro falhar/timeout).
   - Normaliza cada elemento para `{ name, type: 'escola'|'mercado'|'farmacia'|'academia', distance, coordinates }`, calcula distância via haversine, ordena por distância, limita a 20.
   - Sempre CORS + `OPTIONS` handler. Em qualquer erro, responde `200 []` (nunca dado fabricado).
   - Roda em `/api/public/*` para bypass de auth; sem PII, sem escrita.

2. **`src/components/fenomeno/PropertyDetailModal.tsx`**:
   - Substituir a chamada direta a `overpass-api.de` dentro de `fetchOverpassPlaces` por `fetch("/api/public/nearby-overpass", { method:"POST", body: JSON.stringify({ latitude, longitude }) })`.
   - Manter a ordem atual: primeiro tenta `supabase.functions.invoke("nearby-places")` (Google), se vier vazio consulta o proxy Overpass. Nenhuma outra mudança de UI, filtros ou estado vazio.

## Fora de escopo

- Não mexer na função `nearby-places` (Google) nem no fluxo de geocoding do sync.
- Sem alterações de layout/estilo do bloco "Comércios Próximos".
- Sem cache/persistência dos resultados por enquanto (pode ser um passo futuro se quisermos economizar chamadas).
