import type { Metadata } from 'next';
import { HomeContent } from './HomeContent';

export const metadata: Metadata = {
  title: "KPIL'R Men — Prothesiste capillaire",
  description:
    "Prothesiste capillaire specialise dans les transformations naturelles pour homme. Institut prive a Orleans.",
};

export default function HomePage() {
  return <HomeContent />;
}
