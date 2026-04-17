import type { Metadata } from 'next';
import { SoinsContent } from './SoinsContent';

export const metadata: Metadata = {
  title: 'Soins',
  description:
    'Decouvrez nos soins capillaires : protheses, complements, entretien. Resultats naturels garantis.',
  openGraph: {
    title: 'Soins | KPIL R Men',
    description: 'Soins capillaires sur mesure',
  },
};

export default function SoinsPage() {
  return <SoinsContent />;
}
