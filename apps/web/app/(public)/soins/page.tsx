import type { Metadata } from 'next';
import { SoinsContent } from './SoinsContent';

export const metadata: Metadata = {
  title: 'Soins',
  description:
    'Découvrez nos soins capillaires : prothèses, compléments, entretien. Résultats naturels garantis.',
  openGraph: {
    title: 'Soins | KPIL R Men',
    description: 'Soins capillaires sur mesure',
  },
};

export default function SoinsPage() {
  return <SoinsContent />;
}
