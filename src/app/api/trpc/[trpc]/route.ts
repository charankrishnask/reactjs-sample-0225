// src/app/api/trpc/[trpc]/route.ts
import { appRouter } from '@/server/api/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// Implement a fetch-compatible createContext
const createFetchContext = async (opts: { req: Request }) => {
  // If your original createContext needs session, extract it here
  // Example: const session = await getSessionFromRequest(opts.req);
  // For now, return an empty session or adapt as needed
  return { session: null };
};

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createFetchContext,
  });
};

export { handler as GET, handler as POST };
