import type { Metadata } from 'next';
import { SoinsContent } from './SoinsContent';

export const metadata: Metadata = {
  title: 'Soins capillaires à Orléans',
  description:
    'Découvrez nos soins capillaires à Orléans : prothèses, compléments, entretien. Résultats naturels garantis.',
  openGraph: {
    title: 'Soins capillaires à Orléans | KPIL R Men',
    description: 'Soins capillaires sur mesure',
    images: ['/assets/hero-institut.jpg'],
  },
};

export default function SoinsPage() {
  return <SoinsContent />;
}
