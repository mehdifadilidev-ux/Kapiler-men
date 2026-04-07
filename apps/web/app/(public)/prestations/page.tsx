import type { Metadata } from 'next';
import { PrestationsContent } from './PrestationsContent';

export const metadata: Metadata = {
  title: 'Prestations',
  description:
    'Decouvrez nos transformations capillaires : protheses, complements, entretien. Resultats naturels garantis.',
  openGraph: {
    title: 'Prestations | KPIL R Men',
    description: 'Transformations capillaires sur mesure',
  },
};

export default function PrestationsPage() {
  return <PrestationsContent />;
}
