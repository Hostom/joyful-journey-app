# Ajustar nome do site nos resultados do Google

O resultado de pesquisa do domínio `fenomenoimoveis.lovable.app` está aparecendo com o rótulo "Lovable" acima do link, em vez de "Fenômeno Imóveis". Isso acontece porque o Google não encontra sinais estruturados suficientes para identificar a marca, e acaba usando o nome do domínio pai (`.lovable.app`) ou dados de cache antigos.

## O que será feito

1. **Adicionar WebSite schema (JSON-LD) na raiz**
   - Incluir em `src/routes/__root.tsx` um bloco `application/ld+json` do tipo `WebSite`.
   - Campos: `name: "Fenômeno Imóveis"`, `url: "https://fenomenoimoveis.lovable.app"`, `inLanguage: "pt-BR"`.
   - Esse é o sinal mais forte para o Google substituir "Lovable" por "Fenômeno Imóveis" no resultado de pesquisa.

2. **Adicionar RealEstateAgent schema na homepage**
   - Incluir em `src/routes/index.tsx` um bloco `RealEstateAgent` com nome, endereço (Av. Atlântica, 3230), telefone, email, URL e logo.
   - Reforça a identidade da marca e habilita o painel de "negócio local" no Google.

3. **Adicionar Product schema na página de imóvel**
   - Incluir em `src/routes/imoveis.$code.tsx` um bloco `Product`/`Residence` usando dados do loader (nome, descrição, imagens, preço, endereço).
   - Melhora a apresentação dos imóveis em buscas específicas.

4. **Corrigir metadados básicos**
   - Encurtar o título da homepage para no máximo 60 caracteres (atualmente 63).
   - Garantir `canonical` e `og:url` self-referenciais em `/`, `/imoveis` e `/imoveis/$code`.
   - Verificar que `og:site_name` permanece como "Fenômeno Imóveis" em todas as rotas.

5. **Corrigir detalhes de confiança no footer**
   - Corrigir o typo no email de contato: `adm.fenomenoimovies@gmail.com` → `adm.fenomenoimoveis@gmail.com`.
   - Substituir os links `#` de redes sociais por placeholders mais apropriados ou remover até que URLs reais sejam fornecidas.

6. **Conectar Google Search Console (opcional, recomendado)**
   - Configurar o conector `google_search_console` para permitir verificação, acompanhamento de indexação e envio do sitemap.
   - Adicionar a meta-tag de verificação no `<head>` da raiz e enviar `https://fenomenoimoveis.lovable.app/sitemap.xml`.
   - Esta etapa depende de aprovação sua, pois exige autorização do Google.

## Resultado esperado

Após republicar e o Google reindexar (pode levar dias), o resultado de pesquisa de `fenomenoimoveis.lovable.app` deve passar a exibir "Fenômeno Imóveis" como nome do site, em vez de "Lovable". A indexação de imóveis individuais também ficará mais rica com os schemas adicionados.
