import type { Metadata, Viewport } from 'next';
import { Montserrat, Bodoni_Moda } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  style: 'italic',
  variable: '--font-bodoni',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kpilr-men.fr'),
  title: {
    default: 'KPIL R Men — Prothésiste capillaire à Orléans',
    template: '%s | KPIL R Men',
  },
  description:
    'Prothésiste capillaire spécialisé. Transformations naturelles, compléments capillaires sur mesure.',
  openGraph: {
    siteName: 'KPIL R Men',
    locale: 'fr_FR',
    type: 'website',
    images: ['/assets/hero-institut.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/hero-institut.jpg'],
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${bodoniModa.variable}`}>
      <body className="bg-white text-black antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
