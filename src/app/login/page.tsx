'use client';

import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // ✅ If already logged in, skip login page
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/task-board');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary text-white position-relative">
      <div className="position-absolute w-100 text-center" style={{ opacity: 0.1, fontSize: '5rem' }}>
        <p>campus.build</p>
        <p style={{ fontSize: '1.5rem' }}>CAREERS. NOT JOBS</p>
      </div>

      <form onSubmit={handleSubmit} className="z-2" style={{ minWidth: '320px', maxWidth: '400px' }}>
        <h2 className="mb-4 text-center fw-bold">Log in!</h2>
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="email" placeholder="abcd@gmail.com" />
          <label htmlFor="email">Email Address</label>
        </div>
        <div className="form-floating mb-2">
          <input type="password" className="form-control" id="password" placeholder="Enter Password" />
          <label htmlFor="password">Password</label>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
          </div>
          <a href="#" className="text-white text-decoration-underline">Forgot Password?</a>
        </div>
        <Link href="/api/auth/login?returnTo=/task-board" className="btn btn-primary w-100 text-center">
          Log In
        </Link>
      </form>
    </div>
  );
}
