import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// NOTE: attachSupabaseAuth foi removido propositalmente.
// Nenhuma server function deste projeto usa requireSupabaseAuth, e o attacher
// acessa supabase.auth.getSession() no cliente — o proxy do client.ts lança
// "Missing Supabase environment variable(s)" quando VITE_SUPABASE_* não estão
// disponíveis no bundle, quebrando o preview inteiro.
export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
