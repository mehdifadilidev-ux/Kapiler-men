import type { Metadata } from 'next';
import { HomeContent } from './HomeContent';

export const metadata: Metadata = {
  title: 'KPIL R Men — Prothesiste capillaire',
  description:
    'Prothesiste capillaire specialise dans les transformations naturelles. Complements capillaires sur mesure, resultats garantis.',
};

export default function HomePage() {
  return <HomeContent />;
}
