import Link from 'next/link';
import Image from 'next/image';
import { BOOKING_URL } from '@/lib/constants';

const NAV_LINKS = [
  { href: '/presentation', label: 'Presentation' },
  { href: '/soins', label: 'Soins' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/contact', label: 'Contact' },
] as const;

const HOURS = [
  { day: 'Lun', hours: '9h30 - 19h00' },
  { day: 'Mar', hours: '9h30 - 16h00' },
  { day: 'Mer', hours: 'Ferme' },
  { day: 'Jeu', hours: '9h30 - 19h00' },
  { day: 'Ven', hours: '9h30 - 19h00' },
  { day: 'Sam', hours: '9h00 - 18h00' },
  { day: 'Dim', hours: 'Ferme' },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-bois-light bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
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
              Prothesiste capillaire specialise. Institut prive a Orleans.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray">Navigation</p>
            <nav className="mt-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-bois"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-bois"
              >
                Rendez-vous
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray">Contact</p>
            <div className="mt-4 space-y-2 text-sm">
              <p>64 Quai des Augustins</p>
              <p>45100 Orleans</p>
              <p className="mt-3">06 66 97 25 62</p>
              <p>kpilr-men@outlook.fr</p>
            </div>
            <div className="mt-4 flex gap-4">
              <Link
                href="https://www.instagram.com/kpilr_men/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-bois transition-colors hover:text-bois/80"
              >
                Instagram
              </Link>
              <Link
                href="https://www.tiktok.com/@kpilr_men"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-bois transition-colors hover:text-bois/80"
              >
                TikTok
              </Link>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray">Horaires</p>
            <div className="mt-4 space-y-1.5 text-sm">
              {HOURS.map((item) => (
                <div key={item.day} className="flex justify-between">
                  <span>{item.day}</span>
                  <span className={item.hours === 'Ferme' ? 'text-gray' : ''}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-bois-light pt-8 text-center">
          <p className="text-xs text-gray">
            &copy; {new Date().getFullYear()} KPIL&apos;R Men. Tous droits reserves.
          </p>
        </div>
      </div>
    </footer>
  );
}
