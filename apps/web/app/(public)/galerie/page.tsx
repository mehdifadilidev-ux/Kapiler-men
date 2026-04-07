import type { Metadata } from 'next';
import { GalerieContent } from './GalerieContent';

export const metadata: Metadata = {
  title: 'Galerie avant/apres',
  description:
    'Decouvrez nos transformations capillaires en images. Resultats avant et apres de nos clients.',
  openGraph: {
    title: 'Galerie avant/apres | KPIL R Men',
    description: 'Transformations capillaires : resultats avant et apres',
  },
};

export default function GaleriePage() {
  return <GalerieContent />;
}
