// src/server/api/trpc/index.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { tasksRouter } from './routers/tasks';
import { createContext } from './context';

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const appRouter = t.router({
  tasks: tasksRouter,
});

export type AppRouter = typeof appRouter;
