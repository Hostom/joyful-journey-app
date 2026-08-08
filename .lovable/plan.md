# Ajustar fundo da seção "Fale Conosco" sem espaços verdes e com fachada completa

## Problema
A imagem de fundo da loja no mobile está usando `bg-contain` desde o último ajuste, o que deixou barras verdes na parte superior e inferior. A fachada precisa preencher a seção, mas sem ser cortada.

## Solução proposta
Adaptar a seção `#contact` no mobile para ter a mesma proporção da área da fachada na imagem, usando `bg-cover` centralizado. Isso faz o fundo cobrir toda a seção (sem verde) e mantém a fachada completa visível.

Passos:
1. Definir a altura/proporção da seção `#contact` no mobile a partir da imagem da fachada (proporção em torno de 411×1024 da área da fachada).
2. Reduzir o tamanho dos textos, botões e grid na seção para caber dentro da nova altura sem transbordar.
3. Manter o degradê verde e a opacidade de 20% sobre a imagem.
4. Verificar no preview mobile que não há espaços verdes e que a fachada (letreiro e vitrine) aparece por completo.
5. Rodar o build para garantir que não há erros.

## Onde mexer
- `src/routes/index.tsx` — seção `Contact` e classes responsivas de mobile.
- `src/styles.css` — se necessário, adicionar um token utilitário para a proporção do fundo.

## Resultado esperado
Fundo da fachada preenche toda a seção "Fale Conosco" no celular, sem áreas verdes, e a fachada (Fenômeno Imóveis) aparece completa.
