# Plano: ajustar imagem de fundo da seção Fale Conosco para aparecer por completa

## Objetivo
Garantir que a foto da loja Fenômeno Imóveis no fundo da seção "Fale Conosco" seja exibida por completo, sem cortes laterais ou verticais, tanto em telas grandes (desktop) quanto em telas pequenas (mobile). Manter o mesmo filtro escuro e degradê verde já aplicados.

## Contexto confirmado
- A imagem de fundo está em `src/routes/index.tsx`, dentro do componente `Contact`.
- Atualmente ela usa `backgroundImage` com `backgroundSize: "cover"` e `backgroundPosition: "center"`, o que preenche a seção cortando partes da foto quando a proporção da tela difere da proporção da imagem.
- A imagem em `src/assets/loja-fenomeno.jpg.asset.json` é a fachada do escritório Fenômeno Imóveis — Fabrício Dias.

## Etapas
1. Verificar as dimensões/proporção da imagem `loja-fenomeno.jpg` para decidir o ajuste responsivo.
2. Alterar o elemento de fundo da seção `Contact` para exibir a imagem completa, usando `object-fit: contain` em uma tag `<img>` ou `background-size: contain` com `background-repeat: no-repeat` e `background-position: center`.
3. Manter a opacidade de `20%` sobre a imagem e preservar o degradê verde existente (`bg-gradient-to-b` / `bg-forest-deep`) para garantir legibilidade do texto e CTA.
4. Testar visualmente a responsividade: garantir que a imagem não fique distorcida e que o fundo escuro preencha naturalmente as áreas vazias, especialmente no mobile (viewport 390px).
5. Rodar `bun run build` para garantir que a referência do asset e o JSX não quebram.

## Não incluído
- Não alterar textos, botões, modal de lead, formulários, cores ou layout da seção.
- Não adicionar novas animações ou interações.
- Não trocar a imagem por outra.

## Resultado esperado
A seção "Fale Conosco" exibe a foto do escritório completa, sem cortes, em qualquer resolução, mantendo o fundo escuro, o degradê verde e a legibilidade dos textos e CTA's.
