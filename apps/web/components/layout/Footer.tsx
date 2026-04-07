import Link from 'next/link';
import Image from 'next/image';

const FOOTER_LINKS = [
  { href: '/prestations', label: 'Prestations' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/reserver', label: 'Reserver' },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-bois-light bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Image
              src="/assets/logo.jpg"
              alt="KPIL R Men"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <p className="mt-3 text-sm text-gray">
              Prothesiste capillaire specialise. Transformations naturelles et sur mesure.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray">Navigation</p>
            <nav className="mt-4 flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-bois"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray">Contact</p>
            <div className="mt-4 space-y-2 text-sm">
              <p>Du lundi au vendredi</p>
              <p>9h00 - 19h00</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-bois-light pt-8 text-center">
          <p className="text-xs text-gray">
            &copy; {new Date().getFullYear()} KPIL R Men. Tous droits reserves.
          </p>
        </div>
      </div>
    </footer>
  );
}
