## Diagnóstico

- A edge function `nearby-places` **não está publicada** (chamada direta retorna `404 NOT_FOUND`). Por isso o `supabase.functions.invoke("nearby-places")` no `PropertyDetailModal` sempre falha.
- O fallback client-side é o Overpass (OpenStreetMap). Em muitas regiões de SC o Overpass devolve poucos ou nenhum POI, e ainda sofre com timeouts/CORS intermitentes — resultado prático: a lista fica vazia mesmo com coordenadas corretas.
- A função em `supabase/functions/nearby-places/index.ts` já usa a Google Places API (v1 `searchNearby`) e o secret `GOOGLE_PLACES_API_KEY` já está configurado no projeto. Mas ela ainda contém um fallback com estabelecimentos fabricados (`generateMockPlaces`) — o mesmo tipo de dado inventado que foi removido do frontend na correção anterior de QA. Precisa sair também do backend.

## O que fazer

1. **Editar `supabase/functions/nearby-places/index.ts`**
   - Remover `generateMockPlaces` e toda a base hardcoded de estabelecimentos.
   - Se `GOOGLE_PLACES_API_KEY` faltar, responder `[]` (não inventar dados).
   - Se a chamada ao Google falhar (`!response.ok`) ou lançar exceção, responder `[]` com status 200 (nunca dados falsos).
   - Manter o mapeamento de categorias, o cálculo real de distância (haversine) e a ordenação por distância.

2. **Publicar a função** (deploy) para que `supabase.functions.invoke("nearby-places")` pare de responder 404.

3. **Ajustar `src/components/fenomeno/PropertyDetailModal.tsx`**
   - Manter Overpass apenas como *fallback opcional* quando Google devolver vazio, já que ele às vezes tem POIs que a Google não retorna — mas nunca gerar dado sintético.
   - Nenhuma outra mudança de UI: a mensagem "Selecione as categorias e busque…" continua sendo o estado vazio legítimo.

4. **Verificar** com uma chamada direta à função (`supabase--curl_edge_functions`) para as coords do imóvel 00001 (Yachthouse, -27.0068, -48.5915), confirmando que retorna lista real do Google.

## Fora de escopo

- Não mexer no fluxo de geocoding do sync (assunto separado — CRM ainda manda `0/0`).
- Não alterar layout/estilo do bloco "Comércios Próximos".
