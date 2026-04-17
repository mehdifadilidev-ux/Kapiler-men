'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/queries/useAuth';

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/actualites', label: 'Actualites' },
  { href: '/admin/galerie', label: 'Galerie' },
  { href: '/admin/temoignages', label: 'Temoignages' },
  { href: '/admin/services', label: 'Soins' },
];

export function AdminHeader() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <header className="border-b border-bois-light">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <nav className="flex items-center gap-6">
          <Link href="/admin">
            <Image
              src="/assets/logo.jpg"
              alt="KPIL R Men"
              width={100}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-bois ${
                pathname === link.href ? 'text-bois' : 'text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="text-sm text-gray transition-colors hover:text-red-600 disabled:opacity-50"
        >
          Deconnexion
        </button>
      </div>
    </header>
  );
}
