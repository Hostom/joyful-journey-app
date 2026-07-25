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

// attachSupabaseAuth NÃO é registrado: nenhuma serverFn usa requireSupabaseAuth,
// e o attacher chama supabase.auth.getSession() no cliente, o que dispara o proxy
// do client.ts e quebra o preview quando as VITE_SUPABASE_* não estão no bundle.
export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));

