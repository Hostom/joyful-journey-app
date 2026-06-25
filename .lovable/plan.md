## Problema

Em `src/routes/admin.crm.tsx` linha 18, o server function usa `.validator(...)` — API antiga. No TanStack Start atual o método correto é `.inputValidator(...)`. Isso quebra o build da rota e impede `/admin/crm` de funcionar como esperado (a autenticação por API key nunca passa).

## Correção

Em `src/routes/admin.crm.tsx`:

1. Trocar `.validator((key: string) => key)` por `.inputValidator((key: string) => key)` no server fn `validateApiKey` (linha 17-23), mantendo a cadeia `createServerFn(...).inputValidator(...).handler(...)`.
2. Verificar o restante do arquivo (906 linhas) por outras chamadas a `.validator(` e ajustar da mesma forma se existirem.
3. Conferir se a chamada do lado cliente continua válida: `validateApiKey({ data: apiKeyInput.trim() })` — já está correta para o novo formato.

## Fora de escopo

- Não vou mexer no fluxo de UI/abas, nem adicionar link na Navbar, nem mudar variáveis de ambiente (`CRM_LEADS_API_URL`, `SITE_TO_CRM_API_KEY`, `CRM_TO_SITE_BEARER_TOKEN`) — elas continuam sendo lidas no servidor.
- Sem mudanças no design ou em outras rotas.

## Validação

Após o ajuste: acessar `/admin/crm`, inserir a `SITE_TO_CRM_API_KEY` configurada nos secrets e confirmar que o dashboard de configurações abre sem erro de runtime.