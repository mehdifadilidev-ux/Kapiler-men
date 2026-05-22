import type { Metadata } from 'next';
import { GalerieContent } from './GalerieContent';

export const metadata: Metadata = {
  title: 'Galerie',
  description:
    'Découvrez nos réalisations en images : transformations capillaires, institut, événements.',
  openGraph: {
    title: 'Galerie | KPIL R Men',
    description: 'Galerie photos : transformations, institut, événements',
  },
};

export default function GaleriePage() {
  return <GalerieContent />;
}
