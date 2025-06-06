import { getSession } from '@auth0/nextjs-auth0';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

// You can pass the request here if needed
export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession(opts.req, opts.res);
  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
