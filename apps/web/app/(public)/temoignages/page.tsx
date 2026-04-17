import type { Metadata } from 'next';
import { TemoignagesContent } from './TemoignagesContent';

export const metadata: Metadata = {
  title: 'Temoignages',
  description:
    'Decouvrez les avis de nos clients. Ils nous ont fait confiance pour leur transformation capillaire.',
  openGraph: {
    title: 'Temoignages | KPIL R Men',
    description: 'Les avis de nos clients',
  },
};

export default function TemoignagesPage() {
  return <TemoignagesContent />;
}
