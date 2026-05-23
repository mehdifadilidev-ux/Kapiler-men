import type { Metadata } from 'next';
import { TemoignagesContent } from './TemoignagesContent';

export const metadata: Metadata = {
  title: 'Témoignages',
  description:
    'Découvrez les avis de nos clients. Ils nous ont fait confiance pour leur transformation capillaire.',
  openGraph: {
    title: 'Témoignages | KPIL R Men',
    description: 'Les avis de nos clients',
    images: ['/assets/hero-institut.jpg'],
  },
};

export default function TemoignagesPage() {
  return <TemoignagesContent />;
}
