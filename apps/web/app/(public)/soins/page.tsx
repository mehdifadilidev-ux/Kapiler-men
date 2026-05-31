import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { SoinsContent } from './SoinsContent';

export const metadata: Metadata = pageMetadata({
  title: 'Soins capillaires à Orléans',
  description:
    'Découvrez nos soins capillaires à Orléans : prothèses, compléments, entretien. Résultats naturels garantis.',
  path: '/soins',
});

export default function SoinsPage() {
  return <SoinsContent />;
}
