import type { Metadata } from 'next';
import { GalerieContent } from './GalerieContent';

export const metadata: Metadata = {
  title: 'Galerie',
  description:
    'Decouvrez nos realisations en images : transformations capillaires, institut, evenements.',
  openGraph: {
    title: 'Galerie | KPIL R Men',
    description: 'Galerie photos : transformations, institut, evenements',
  },
};

export default function GaleriePage() {
  return <GalerieContent />;
}
