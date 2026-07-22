# Corrigir localização do mapa dos imóveis

## Causa
- Banco: `properties.latitude` e `longitude` estão `NULL` nos imóveis sincronizados — o CRM não envia esses campos.
- Site: `PropertyDetailModal.getCoordinates()` cai num fallback hardcoded por cidade/bairro (ex.: Praia Brava → `-26.96, -48.62`), então o pin marca o centro do bairro em vez do imóvel.
- Google Maps API está OK — só renderiza o que o site manda.

## Mudanças

### 1. Geocodificar automaticamente no sync (`src/routes/api/public/properties/sync.ts`)
No handler `POST`, quando o payload chegar sem `latitude`/`longitude` válidos (ou quando `location`/`neighborhood`/`name` mudarem), chamar a Google Geocoding API usando o secret `GOOGLE_MAPS_API_KEY` já existente:
- Query: `"{name}, {neighborhood}, {location}, Brasil"` (fallback progressivo se resultar `ZERO_RESULTS`: remove `name`, depois só `location`).
- Persistir `latitude`/`longitude` retornados no upsert.
- Se a geocodificação falhar, logar warning com o endereço tentado e seguir gravando sem coords (não bloquear o sync).
- Se o CRM **enviar** lat/lng, respeitar o valor recebido (prioridade sobre geocoding).

### 2. Remover fallback enganoso (`src/components/fenomeno/PropertyDetailModal.tsx`)
- `getCoordinates()` passa a retornar `null` quando o imóvel não tem `latitude`/`longitude` reais.
- Quando `null`, esconder o bloco "Localização e Comodidades" (ou mostrar aviso "Localização exata sob consulta") em vez de exibir um pin no lugar errado.

### 3. Backfill dos 2 imóveis existentes
Rodar uma migration one-shot ou script de geocodificação para preencher lat/lng dos códigos `00001` e `00002` já no banco, para não depender de um novo POST do CRM.

### 4. Documentar no `/admin/crm`
Adicionar nota no painel: `latitude` e `longitude` são opcionais; se ausentes, o site geocodifica automaticamente a partir de `name + neighborhood + location`. Recomendado enviar para máxima precisão.

## Fora de escopo
- Nenhuma mudança no componente `PropertyMap` em si (renderização continua igual).
- Sem mudanças no CRM — a correção funciona mesmo que o CRM nunca envie coords.
