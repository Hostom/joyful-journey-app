## Disparar evento `lead_enviado_crm` no GTM após sucesso no CRM

Adicionar o push no `dataLayer` exatamente no ponto de sucesso da submissão do lead, em `src/components/fenomeno/ContactLeadModal.tsx`, logo após confirmarmos que `result.ok === true` (ou seja, o CRM aceitou) e antes do redirect para WhatsApp/E-mail.

### Mudança

Em `src/components/fenomeno/ContactLeadModal.tsx`, dentro de `handleSubmit`, após o bloco `if (!result.ok)` e antes de `onOpenChange(false)`:

```js
if (typeof window !== "undefined") {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "lead_enviado_crm" });
}
```

### Notas técnicas

- O push só ocorre no caminho de sucesso (lead efetivamente registrado no CRM via `submitLead`), conforme pedido.
- Guard `typeof window !== "undefined"` para evitar erro em SSR.
- Tipagem: adicionar `declare global { interface Window { dataLayer: any[] } }` no topo do arquivo para satisfazer o TypeScript estrito.
- Nenhuma alteração no GTM/gtag já instalado em `__root.tsx`.

### Validação

- Abrir o modal de contato, enviar um lead válido e verificar no console: `window.dataLayer` contém `{ event: 'lead_enviado_crm' }`.
