import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { RendezVousContent } from './RendezVousContent';

export const metadata: Metadata = pageMetadata({
  title: 'Prendre rendez-vous',
  description:
    "Réservez votre rendez-vous en ligne chez KPIL'R Men, prothésiste capillaire à Orléans : diagnostic, transformation et entretien du complément capillaire.",
  path: '/rendez-vous',
});

export default function RendezVousPage() {
  return <RendezVousContent />;
}
