## Problema

O console mostra `Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY` originado de `listProperties`, que importa `@/integrations/supabase/client.server` (service role) para uma simples leitura pública de imóveis. Isso viola duas regras do stack:

1. `supabaseAdmin` não deve ser usado como cliente Data API padrão para leituras públicas. As guidelines avisam explicitamente que isso pode quebrar (incluindo o erro de envs ausentes em runtime).
2. Para listas públicas, deve-se usar o **cliente publishable do servidor** com policy `TO anon SELECT` na tabela.

Hoje o `try/catch` em volta deveria capturar a exceção e cair no fallback `STATIC_PROPERTIES`, mas o erro continua sendo logado/propagado pelo proxy do `supabaseAdmin` antes do catch funcionar como esperado, poluindo o console em produção.

## Plano

### 1. Trocar `supabaseAdmin` por cliente publishable em `src/lib/properties.functions.ts`

Dentro do handler do `listProperties`:
- Ler `process.env.SUPABASE_URL` e `process.env.SUPABASE_PUBLISHABLE_KEY`.
- Se qualquer um faltar, retornar `STATIC_PROPERTIES` silenciosamente (sem lançar).
- Caso contrário, criar um `createClient` local (sem persistência de sessão) e fazer o `select` normalmente.
- Manter o merge atual com `STATIC_PROPERTIES` por código.

### 2. Garantir policy pública de leitura na tabela `properties`

Verificar (e adicionar via migration se faltar) policy `FOR SELECT TO anon USING (true)` mais `GRANT SELECT ON public.properties TO anon;`. Isso permite a leitura com a chave publishable sem service role.

### 3. Não tocar em `src/routes/api/public/properties/sync.ts`

Esse endpoint é webhook autenticado por bearer e precisa de `supabaseAdmin` para escrita — mantém como está.

## Resultado esperado

- Console limpo na home, `/imoveis` e `/imoveis/$code`.
- Sem dependência de service role para leitura pública.
- Fallback estático continua funcionando se o banco estiver indisponível.
