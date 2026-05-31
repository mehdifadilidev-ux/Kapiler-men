import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { HomeContent } from './HomeContent';

export const metadata: Metadata = pageMetadata({
  title: "KPIL'R Men — Prothésiste capillaire à Orléans",
  description:
    "Prothésiste capillaire spécialisé dans les transformations naturelles pour homme. Institut privé à Orléans.",
  path: '',
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeContent />;
}
