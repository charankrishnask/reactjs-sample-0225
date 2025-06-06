// src/app/api/trpc/[trpc]/route.ts
import { appRouter } from '@/server/api/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// ✅ Minimal fetch-compatible createContext
const createFetchContext = async () => {
  return { session: null };
};

// ✅ Unified handler for GET/POST
const handler = (req: Request): Promise<Response> => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createFetchContext,
  });
};

export { handler as GET, handler as POST };
