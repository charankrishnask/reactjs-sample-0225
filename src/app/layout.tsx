'use client';

import { ReactNode, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';

import { UserProvider, useUser } from '@auth0/nextjs-auth0';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';
import { getClient } from '@/utils/trpc';
import Link from 'next/link';

const queryClient = new QueryClient();

// 🔹 Navbar component
function Navbar() {
  const { user } = useUser();

  return (
    <nav className="navbar bg-primary navbar-dark px-3 d-flex justify-content-between">
      <div className="d-flex align-items-center gap-2">
        {/* ✅ Logo image must exist in public/logo.svg */}
        <img src="/logo.svg" alt="Logo" height="40" />
        <span className="navbar-brand mb-0 h1">TasksBoard</span>
      </div>

      <div className="d-flex align-items-center gap-3">
        {user?.picture && (
          <img
            src={user.picture}
            alt="User"
            className="rounded-circle"
            width="40"
            height="40"
          />
        )}
        {user && (
          <a href="/api/auth/logout" className="btn btn-outline-light btn-sm">
            Logout
          </a>
        )}
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // ✅ Dynamically import Bootstrap JS
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <html lang="en">
      <body>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <trpc.Provider client={getClient()} queryClient={queryClient}>
              <Navbar />
              <main className="p-3">{children}</main>
            </trpc.Provider>
          </QueryClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
