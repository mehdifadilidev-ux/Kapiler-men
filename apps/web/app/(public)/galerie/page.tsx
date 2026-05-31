import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { GalerieContent } from './GalerieContent';

export const metadata: Metadata = pageMetadata({
  title: 'Galerie',
  description:
    'Découvrez nos réalisations en images : transformations capillaires, institut, événements.',
  path: '/galerie',
});

export default function GaleriePage() {
  return <GalerieContent />;
}
