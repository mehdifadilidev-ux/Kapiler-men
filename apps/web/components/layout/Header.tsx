'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/presentation', label: 'Presentation' },
  { href: '/soins', label: 'Soins' },
  { href: '/temoignages', label: 'Temoignages' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/contact', label: 'Contact' },
] as const;

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/assets/logo.jpg"
            alt="KPIL R Men"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
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
          <Link
            href="/rendez-vous"
            className="bg-bois px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
          >
            Rendez-vous
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label="Menu"
        >
          <span
            className={`block h-0.5 w-6 bg-black transition-transform ${mobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-black transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-black transition-transform ${mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="border-t border-bois-light px-6 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium ${
                  pathname === link.href ? 'text-bois' : 'text-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/rendez-vous"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 bg-bois px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white"
            >
              Rendez-vous
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
