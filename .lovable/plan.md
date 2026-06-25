## Objetivo

Separar a chave do CRM em duas secrets:

- `SITE_TO_CRM_API_KEY` (já existe) — continua autenticando o acesso à tela `/admin/crm`.
- `CRM_WEBHOOK_TOKEN` (nova) — valor enviado no campo `webhook_token` do body ao criar leads no CRM.

## Passos

1. Criar a nova secret `CRM_WEBHOOK_TOKEN` via `add_secret` (form seguro para você colar o valor fornecido pelo CRM).
2. Atualizar `src/routes/admin.crm.tsx`:
  - Na aba de variáveis de ambiente (`EnvTable`), adicionar uma linha para `CRM_WEBHOOK_TOKEN` descrevendo "Enviado no corpo como `webhook_token` ao criar leads no CRM".
  - Ajustar a descrição de `SITE_TO_CRM_API_KEY` para deixar claro que ela serve só para autenticar a tela `/admin/crm` (não vai mais no body).
  - No exemplo de payload (`CodeBlock`), trocar a anotação do `webhook_token` para referenciar `CRM_WEBHOOK_TOKEN` em vez de `SITE_TO_CRM_API_KEY`.
  - Em qualquer texto do `InfoCard`/integração que cite a origem do `webhook_token`, apontar para `CRM_WEBHOOK_TOKEN`.

## Fora do escopo

- Não há código no app que efetivamente envie leads ao CRM hoje (a página é documentação/checagem). Se/quando esse envio for implementado, ele deverá ler `process.env.CRM_WEBHOOK_TOKEN` dentro de um server function/route — sem mudanças extras agora.  
  
{
  "name": "Maria Oliveira",
  "email": "[maria@email.com](mailto:maria@email.com)",
  "phone": "+5547999999999",
  "message": "Tenho interesse no apartamento Beira Mar.",
  "property_id": "prop_abc123",
  "source": "site",
  "webhook_token": "wh_tok_xxxxxxxxxxxxxxxx"
}  
  
Esse é o Body que envia os leads ao crm, a ultima lina dele é o webhook_token que estamos criando, esse token deve ficar na secret do lovable e ser usado ali
- &nbsp;