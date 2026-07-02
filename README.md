# Fenômeno Imóveis · Integração de Mapas e CRM

Este repositório contém a infraestrutura do site institucional da imobiliária **Fenômeno Imóveis** desenvolvida em Node.js com Supabase e React. 
Esta seção detalha as configurações necessárias para integrar a consulta de imóveis (CRM externo), a busca de comércios próximos e a renderização do mapa dinâmico nos detalhes de cada imóvel.

---

## 1. Secrets no Supabase (Configuração de Backend)

As seguintes variáveis de ambiente devem ser configuradas como **Secrets** no painel do Supabase do projeto para alimentar as Edge Functions de forma segura. Elas **nunca** devem ser expostas no frontend ou possuir o prefixo `VITE_`.

| Nome da Secret | Descrição | Exemplo de Valor |
| :--- | :--- | :--- |
| `CRM_API_URL` | URL do endpoint da API do CRM externo para buscar imóveis. | `https://api.crm-externo.com/v1/properties` |
| `CRM_API_KEY` | Chave secreta de autenticação usada no cabeçalho `x-api-key` para requisições ao CRM. | `crm_sec_abc123xyz789...` |
| `GOOGLE_PLACES_API_KEY` | Chave privada do Google Cloud com a **Places API** ativada (usada para Nearby Search - New). | `AIzaSyD-PrivatePlacesKey...` |

### Como configurar no Supabase:
Você pode configurar os Secrets usando o Supabase CLI ou diretamente no painel do Supabase:
```bash
# Via CLI
supabase secrets set CRM_API_URL="https://..." CRM_API_KEY="x..." GOOGLE_PLACES_API_KEY="AIza..."
```

---

## 2. Variáveis do Frontend (Vite)

Para renderizar o mapa visualmente no navegador do cliente, é necessário carregar a **Maps JavaScript API** do Google Maps. Para isso, configure a seguinte variável no arquivo `.env` local ou nas configurações de deploy da plataforma (como no Lovable):

| Nome da Variável | Descrição | Exemplo de Valor |
| :--- | :--- | :--- |
| `VITE_GOOGLE_MAPS_API_KEY` | Chave pública do Google Maps JavaScript API. | `AIzaSyB-PublicMapsKey...` |

---

## 3. Segurança e Restrição de Domínio no Google Cloud Console

Como a chave `VITE_GOOGLE_MAPS_API_KEY` é pública e exposta no código do frontend, é **estritamente obrigatório** configurar restrições de uso para evitar que terceiros utilizem a sua chave em outros sites.

### Passo a Passo para Restrição:
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Vá em **APIs e Serviços** > **Credenciais**.
3. Localize a chave de API correspondente à sua chave pública (`VITE_GOOGLE_MAPS_API_KEY`) e clique no ícone de editar (lápis).
4. Em **Restrições de aplicativos**, selecione **Sites (referenciadores HTTP)**.
5. Em **Restrições de sites**, clique em **Adicionar** e insira os padrões de URL permitidos:
   - `http://localhost:*/*` (para desenvolvimento local)
   - `https://fenomenoimoveis.com.br/*` (domínio oficial de produção)
   - `https://*.fenomenoimoveis.com.br/*` (subdomínios de produção)
   - `https://*.lovable.app/*` (domínio de preview do Lovable, caso utilize)
6. Em **Restrições de API**, você pode limitar a chave para funcionar apenas com a **Maps JavaScript API**.
7. Clique em **Salvar**.

*Nota: As chaves de backend (`GOOGLE_PLACES_API_KEY` e `CRM_API_KEY`) rodam do lado do servidor nas Supabase Edge Functions e estão protegidas por padrão contra exposição ao público.*
