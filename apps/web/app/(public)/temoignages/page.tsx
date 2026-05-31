import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { TemoignagesContent } from './TemoignagesContent';

export const metadata: Metadata = pageMetadata({
  title: 'Témoignages',
  description:
    'Découvrez les avis de nos clients. Ils nous ont fait confiance pour leur transformation capillaire.',
  path: '/temoignages',
});

export default function TemoignagesPage() {
  return <TemoignagesContent />;
}
