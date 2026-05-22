'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const admin = useAuthStore((s) => s.admin);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-montserrat text-2xl font-semibold">Espace Admin</h1>
          <p className="mt-2 text-gray">Vous devez vous connecter pour accéder au dashboard.</p>
          <Link
            href="/admin/login"
            className="mt-6 inline-block bg-bois px-6 py-3 text-sm font-semibold text-white"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-montserrat text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray">Bienvenue, {admin?.email}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/actualites"
          className="border border-bois-light p-8 transition-colors hover:bg-bois-light"
        >
          <h2 className="font-montserrat text-xl font-semibold">Actualités</h2>
          <p className="mt-2 text-sm text-gray">Gérer la bannière d&apos;actualités</p>
        </Link>

        <Link
          href="/admin/galerie"
          className="border border-bois-light p-8 transition-colors hover:bg-bois-light"
        >
          <h2 className="font-montserrat text-xl font-semibold">Galerie</h2>
          <p className="mt-2 text-sm text-gray">Gérer les photos de la galerie</p>
        </Link>

        <Link
          href="/admin/temoignages"
          className="border border-bois-light p-8 transition-colors hover:bg-bois-light"
        >
          <h2 className="font-montserrat text-xl font-semibold">Témoignages</h2>
          <p className="mt-2 text-sm text-gray">Gérer les avis clients</p>
        </Link>

        <Link
          href="/admin/services"
          className="border border-bois-light p-8 transition-colors hover:bg-bois-light"
        >
          <h2 className="font-montserrat text-xl font-semibold">Prestations</h2>
          <p className="mt-2 text-sm text-gray">Gérer les prestations et tarifs</p>
        </Link>
      </div>
    </div>
  );
}
