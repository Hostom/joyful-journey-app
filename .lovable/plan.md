Plano para destravar o site e limpar esse erro:

1. Remover do `src/start.ts` o `functionMiddleware: [attachSupabaseAuth]`, porque hoje não há nenhuma server function protegida por login no app e esse middleware chama `supabase.auth.getSession()` em toda chamada de server function.

2. Remover o import `attachSupabaseAuth` do mesmo arquivo, eliminando o carregamento do cliente do backend no navegador durante a listagem pública de imóveis.

3. Manter `listProperties` como está: se as variáveis do backend existirem, ele busca os imóveis no banco; se não existirem, retorna os imóveis estáticos sem quebrar a página.

4. Validar `/` e `/imoveis` no preview conferindo que a página carrega e que o erro `Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY` não aparece mais.

Detalhe técnico: o stack trace do print mostra que a quebra acontece no browser antes/durante a chamada de `listProperties`; o gatilho mais provável é o middleware global de token importando `@/integrations/supabase/client`, que exige variáveis públicas mesmo para uma página pública sem login.