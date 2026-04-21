import type { Metadata } from 'next';
import { BOOKING_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Presentation',
  description:
    "Decouvrez KPIL'R Men, institut de prothese capillaire pour homme a Orleans. Un savoir-faire au service de votre image.",
  openGraph: {
    title: 'Presentation | KPIL R Men',
    description: 'Institut de prothese capillaire pour homme a Orleans',
  },
};

export default function PresentationPage() {
  return (
    <main className="px-6 py-24">
      {/* Intro */}
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Presentation</p>
        <h1 className="mt-6 font-montserrat text-4xl font-semibold md:text-5xl">
          Un savoir-faire au service de votre image
        </h1>
        <p className="mt-6 font-bodoni text-xl italic text-gray">
          Des solutions adaptees a chaque homme.
        </p>
      </section>

      {/* Le concept */}
      <section className="mx-auto mt-24 max-w-4xl">
        <h2 className="font-montserrat text-2xl font-semibold">Le concept</h2>
        <p className="mt-6 leading-relaxed text-gray">
          Une des seules professionnelles de la coiffure a proposer des solutions capillaires souvent
          vendues comme de simples perruques. L&apos;idee ici est de fournir un soin complet :
        </p>
        <ul className="mt-6 space-y-3 text-gray">
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Une ecoute, un accompagnement personnalise</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Une prothese naturelle, discrete et adaptee aux besoins et aux budgets</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Une coupe professionnelle selon les envies</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Un suivi de qualite et une adaptation constante</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Le tout dans une discretion totale et un environnement privilegie</span>
          </li>
        </ul>
        <p className="mt-6 leading-relaxed text-gray">
          Au centre du concept : proposer des solutions en prothese capillaire adaptees a chacun,
          qu&apos;elles soient standards ou personnalisees, selon les besoins, le mode de vie et les
          attentes. L&apos;objectif n&apos;est pas d&apos;imposer, mais de conseiller et
          d&apos;accompagner avec justesse.
        </p>
        <p className="mt-4 leading-relaxed text-gray">
          Parce que l&apos;image masculine est un ensemble harmonieux, l&apos;accompagnement peut
          inclure la mise en valeur de la barbe et des soins du visage cibles, afin d&apos;assurer
          une coherence globale.
        </p>
      </section>

      {/* Le lieu */}
      <section className="mt-20 bg-bois-light px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-montserrat text-2xl font-semibold">Le lieu</h2>
          <p className="mt-6 leading-relaxed text-gray">
            Pense comme un lieu intime et confidentiel, l&apos;institut est loin de l&apos;agitation
            d&apos;un salon traditionnel. Chaque rendez-vous se deroule dans une atmosphere elegante
            et apaisante, inspiree d&apos;un univers barber revisite.
          </p>
          <p className="mt-4 leading-relaxed text-gray">
            Les tons blanc, noir et bois naturel creent un equilibre entre modernite, sobriete et
            chaleur, renforce par une lumiere douce qui accompagne chaque moment de soin.
          </p>
        </div>
      </section>

      {/* La gerante */}
      <section className="mx-auto mt-20 max-w-4xl">
        <h2 className="font-montserrat text-2xl font-semibold">La gerante</h2>
        <p className="mt-6 leading-relaxed text-gray">
          Forte de 23 ans d&apos;experience dans la coiffure, elle a toujours eu a coeur
          d&apos;evoluer et d&apos;affiner son expertise. Au fil des annees, elle a identifie les
          besoins specifiques des hommes : discretion, ecoute, comprehension et solutions reellement
          adaptees.
        </p>
        <p className="mt-4 leading-relaxed text-gray">
          C&apos;est cette vision qui l&apos;a conduite a creer KPIL&apos;R Men.
        </p>
      </section>

      {/* Les produits */}
      <section className="mt-20 bg-bois-light px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-montserrat text-2xl font-semibold">Les produits</h2>
          <p className="mt-6 leading-relaxed text-gray">
            L&apos;exigence passe aussi par le choix des produits : des gammes composees a 98%
            d&apos;ingredients d&apos;origine naturelle. Ils sont selectionnes soigneusement pour
            respecter la peau, preserver le cuir chevelu et proteger le complement capillaire. Tout
            en etant pratiques d&apos;utilisation pour l&apos;entretien au quotidien.
          </p>
          <p className="mt-4 leading-relaxed text-gray">
            Les partenaires sont clairs et transparents pour assurer une confiance totale.
          </p>
        </div>
      </section>

      {/* Conclusion */}
      <section className="mx-auto mt-20 max-w-4xl text-center">
        <p className="font-bodoni text-xl italic leading-relaxed text-gray">
          Chaque homme beneficie d&apos;un moment personnel, d&apos;une ecoute attentive et
          d&apos;un accompagnement precis dans un cadre raffine et rassurant.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block bg-bois px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
        >
          Prendre rendez-vous
        </a>
      </section>
    </main>
  );
}
