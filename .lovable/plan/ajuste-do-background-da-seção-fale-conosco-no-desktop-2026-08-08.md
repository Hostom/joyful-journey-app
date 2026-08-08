Ajuste do background da seção "Fale Conosco" no Desktop

Objetivo: no desktop, usar a imagem paisagem original (`loja-fenomeno.jpg`) para preencher toda a seção, enquanto o mobile continua com a imagem vertical (`loja-fenomeno-mobile.jpg`).

Escopo de mudanças:
- `src/routes/index.tsx` na seção `Contact`:
  - Manter duas camadas de background: uma para `md:hidden` (mobile) e outra para `hidden md:block` (desktop).
  - No desktop, usar `lojaFenomenoAsset` (imagem paisagem original) com `bg-cover bg-center` no lugar do `bg-contain` atual, para que a foto ocupe toda a seção sem espaços verdes.
  - Manter a opacidade em 20% e o degradê verde sobreposto.
  - Preservar a compactação responsiva do conteúdo mobile já ajustada.

- Validação:
  - Capturar screenshots do desktop e mobile na seção `#contact` para confirmar que não há espaços verdes e que a imagem está preenchendo toda a seção.
  - Rodar `bun run build` para garantir que o projeto continua compilando.

Observação: como a imagem paisagem é 809×606 (≈ 4:3) e a seção desktop é um pouco mais alta, usar `bg-cover` pode recortar levemente a parte superior/inferior. Isso é esperado para eliminar o espaço verde. A fachada central permanece visível.
