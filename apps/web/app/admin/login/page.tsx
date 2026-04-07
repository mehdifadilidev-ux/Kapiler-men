'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/queries/useAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push('/admin');
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-montserrat text-2xl font-semibold">Connexion admin</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full border border-gray/30 px-4 py-3 text-sm focus:border-bois focus:outline-none"
            />
          </div>

          {login.isError && (
            <p className="text-sm text-red-600">Identifiants invalides.</p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-bois py-3 text-sm font-semibold text-white transition-colors hover:bg-bois/90 disabled:opacity-50"
          >
            {login.isPending ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
