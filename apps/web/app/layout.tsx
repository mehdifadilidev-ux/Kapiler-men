import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kpilr-men.fr'),
  title: {
    default: 'KPIL R Men — Prothésiste capillaire',
    template: '%s | KPIL R Men',
  },
  description:
    'Prothésiste capillaire spécialisé. Transformations naturelles, compléments capillaires sur mesure.',
  openGraph: {
    siteName: 'KPIL R Men',
    locale: 'fr_FR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white text-black antialiased">{children}</body>
    </html>
  );
}
