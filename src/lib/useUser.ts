// src/lib/useUser.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  const { data, error, isLoading } = useSWR('/api/auth/me', fetcher);

  return {
    user: data?.user || null,
    isLoading,
    error,
  };
}
