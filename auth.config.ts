// auth.config.ts
import {
  handleAuth,
  handleLogin,
  handleLogout,
  handleCallback,
  handleProfile,
} from '@auth0/nextjs-auth0';
import type { NextRequest } from 'next/server';

export const GET = handleAuth({
  async login(req: NextRequest) {
    try {
      return handleLogin(req, {
        returnTo: '/task-board', // redirect after login
      });
    } catch (err) {
      return new Response((err as Error).message, { status: 500 });
    }
  },
  logout: handleLogout,
  callback: handleCallback,
  profile: handleProfile,
});
