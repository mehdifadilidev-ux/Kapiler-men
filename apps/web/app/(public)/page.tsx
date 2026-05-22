import type { Metadata } from 'next';
import { HomeContent } from './HomeContent';

export const metadata: Metadata = {
  title: "KPIL'R Men — Prothésiste capillaire",
  description:
    "Prothésiste capillaire spécialisé dans les transformations naturelles pour homme. Institut privé à Orléans.",
};

export default function HomePage() {
  return <HomeContent />;
}
