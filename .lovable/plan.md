## Objetivo
Impedir que o `PropertyDetailModal` feche quando o usuário clica no widget do WhatsApp (FAB flutuante ou o card do chat) enquanto visualiza um imóvel.

## Diagnóstico
- `PropertyDetailModal` usa o `Dialog` de `src/components/ui/dialog.tsx`, que já tem um helper `isWhatsAppClick` procurando pela classe `.whatsapp-clickable` para cancelar `onPointerDownOutside` / `onInteractOutside` / `onFocusOutside`.
- O `WhatsAppButton` já aplica `whatsapp-clickable` no FAB e no container do widget.
- Mesmo assim o modal fecha. Causa provável: o Radix Dialog dispara `onPointerDownOutside` no `pointerdown`, mas o widget do WhatsApp só é montado no DOM **depois** do clique no FAB (renderização condicional `{isOpen && ...}`). Em cliques posteriores dentro do widget, o `composedPath` funciona; mas o problema real acontece com o **overlay do Dialog** (`bg-black/35`) que fica em `z-50` cobrindo a tela — o FAB está em `z-[9999]`, então o clique chega, mas o Radix trata como "outside" e aciona o fechamento. O check depende de `e.detail.originalEvent`/`nativeEvent`, e nem sempre esses caminhos existem para todos os handlers do Radix (o `onFocusOutside` recebe um `FocusEvent`, sem `composedPath` no target esperado).

## Correção
Endurecer a detecção de clique no WhatsApp no `Dialog`:

1. Em `src/components/ui/dialog.tsx`, no `DialogContent`, adicionar cheque baseado em `document.activeElement` e em uma coordenada global capturada por listener `pointerdown` no `window` (registrado uma vez), guardando o último elemento clicado. Usar esse elemento como fallback quando o evento do Radix não trouxer `originalEvent`.
2. Ampliar `isWhatsAppClick` para também aceitar quando `document.querySelector('.whatsapp-clickable:hover')` existe, ou quando o `lastPointerTarget?.closest('.whatsapp-clickable')` for verdadeiro.
3. Não mudar nada no `WhatsAppButton` — a classe `.whatsapp-clickable` já está nos dois nós certos (FAB e widget). Confirmar que o portal do widget/FAB permanece fora do portal do Dialog (já está — ele é renderizado no `__root.tsx`).

## Detalhes técnicos
- Adicionar em `dialog.tsx`, no escopo do módulo:
  ```ts
  let lastPointerDownEl: EventTarget | null = null;
  if (typeof window !== "undefined") {
    window.addEventListener("pointerdown", (e) => { lastPointerDownEl = e.target; }, true);
  }
  ```
  Guardar comportamento SSR-safe (checar `typeof window`).
- Atualizar `isWhatsAppClick` para tentar, em ordem:
  1. `e.detail.originalEvent.composedPath()` (atual)
  2. `e.target.closest('.whatsapp-clickable')` (atual)
  3. `(lastPointerDownEl as HTMLElement)?.closest?.('.whatsapp-clickable')` (novo)
- Sem alterações em lógica de negócio, apenas UI/comportamento do Dialog.

## Verificação
- Abrir um imóvel (modal aberto) na home / listagem.
- Clicar no FAB do WhatsApp → widget abre, modal permanece aberto.
- Clicar dentro do widget (inputs, botão) → modal permanece aberto.
- Fechar o widget clicando fora dele mas dentro do overlay do modal → modal deve fechar normalmente (comportamento inalterado).
- Rodar em Playwright headless contra `localhost:8080` para confirmar visualmente.
