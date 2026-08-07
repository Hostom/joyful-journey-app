# Plano: trocar imagem de fundo da seção Fale Conosco

## Objetivo
Substituir a imagem de fundo da seção "Fale Conosco" (contato) na landing page por uma foto do escritório da Fenômeno Imóveis enviada pelo usuário, mantendo o mesmo filtro e degradê verde já aplicados no local.

## Contexto confirmado
- A seção de contato vive em `src/routes/index.tsx` (componente `Contact`).
- Atualmente ela usa uma imagem do Unsplash (`https://images.unsplash.com/photo-1542361345-89e58247f2d5?...`) com `opacity-20` sobre o fundo `bg-forest-deep`.
- A imagem anexada (`IMG_9591.jpeg`) mostra a fachada do escritório Fenômeno Imóveis — Fabrício Dias.

## Etapas
1. Criar o asset Lovable para `IMG_9591.jpeg` via `lovable-assets create`, gerando o arquivo `.asset.json` em `src/assets/`.
2. Atualizar `src/routes/index.tsx` no componente `Contact`:
   - Importar o novo asset.
   - Substituir o `backgroundImage` da `<div>` absoluta pela URL do asset.
   - Manter `opacity-20`, `bg-forest-deep`, `bg-gradient-to-b` (ou degradê já existente) e o posicionamento centralizado, sem alterar a paleta de cores ou sobreposições.
3. Verificar se o efeito visual continua consistente com o restante da página (fundo escuro, textos em creme/dourado legíveis).
4. Rodar `bun run build` para garantir que a referência do asset e o JSX não quebram.

## Não incluído
- Não alterar textos, botões, modal de lead, formulários, cores ou layout da seção.
- Não adicionar novas animações ou interações.

## Resultado esperado
A seção "Fale Conosco" exibe a foto do escritório como fundo, com o mesmo filtro escuro e degradê verde, mantendo a legibilidade dos textos e CTA's.
