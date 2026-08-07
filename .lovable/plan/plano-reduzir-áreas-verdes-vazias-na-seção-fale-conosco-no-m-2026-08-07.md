&nbsp;

Não é para fazer nada, eu só quero saber o tamanho da seção para poder ajustar a imagem com o Gemini IA

&nbsp;

&nbsp;

# Plano: reduzir áreas verdes vazias na seção Fale Conosco no mobile

## Objetivo

Diminuir as áreas de fundo verde sem imagem na seção "Fale Conosco" no mobile, ajustando a altura da seção para ficar mais proporcional à foto da loja (809x606, formato paisagem 4:3), sem cortar a imagem.

## Contexto confirmado

- A imagem `loja-fenomeno.jpg` tem dimensões 809x606, ou seja, proporção paisagem (~4:3).
- A seção `Contact` em `src/routes/index.tsx` usa `py-32` (128px de padding vertical) e contém título, subtítulo, dois botões e três colunas de informações.
- Com `background-size: contain`, a foto se ajusta à largura do mobile e fica com altura menor que a seção, deixando faixas verdes em cima e embaixo.

## Etapas

1. Medir a altura real renderizada da seção `#contact` no mobile (viewport 390x844) usando o preview/browser.
2. Reduzir o padding vertical da seção no mobile, trocando `py-32` por algo como `py-16 md:py-24 lg:py-32` para aproximar a altura da seção à altura da imagem em `contain`.
3. Verificar se a redução de padding afeta a legibilidade e o espaçamento entre os elementos internos (título, botões, informações). Se necessário, ajustar o gap interno apenas no mobile.
4. Capturar screenshots em desktop e mobile para confirmar que a imagem ainda aparece completa e que as áreas verdes vazias diminuíram.
5. Rodar `bun run build` para garantir que o JSX não quebra.

## Não incluído

- Não voltar a cortar a imagem.
- Não alterar textos, botões, modal de lead, formulários, cores ou layout além do padding vertical da seção.
- Não substituir a imagem por outra.

## Resultado esperado

A seção "Fale Conosco" no mobile fica mais compacta, com a foto da loja ocupando uma maior proporção do fundo e menos áreas verdes vazias, mantendo a imagem completa e o degradê/filtro existente.