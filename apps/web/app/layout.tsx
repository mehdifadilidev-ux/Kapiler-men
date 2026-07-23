import type { Metadata, Viewport } from 'next';
import { Montserrat, Bodoni_Moda } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManager } from '@next/third-parties/google';
import './globals.css';

const GTM_ID = 'GTM-PZVTM5ZQ';

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
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kpilr-men.fr'),
  title: {
    default: "KPIL'R Men — Prothésiste capillaire à Orléans",
    template: "%s | KPIL'R Men",
  },
  description:
    'Prothésiste capillaire spécialisé. Transformations naturelles, compléments capillaires sur mesure.',
  openGraph: {
    siteName: "KPIL'R Men",
    locale: 'fr_FR',
    type: 'website',
    images: ['/assets/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${bodoniModa.variable}`}>
      <GoogleTagManager gtmId={GTM_ID} />
      <body className="bg-white text-black antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
