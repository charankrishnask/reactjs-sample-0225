'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/api/trpc'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

export const trpc = createTRPCReact<AppRouter>()

export function getClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        transformer: superjson, // ✅ moved here!
      }),
    ],
  })
}
