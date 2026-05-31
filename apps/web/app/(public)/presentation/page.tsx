import type { Metadata } from 'next';
import Image from 'next/image';
import { pageMetadata } from '@/lib/seo';
import { BOOKING_URL } from '@/lib/constants';

export const metadata: Metadata = pageMetadata({
  title: 'Présentation',
  description:
    "Découvrez KPIL'R Men, institut de prothèse capillaire pour homme à Orléans. Un savoir-faire au service de votre image.",
  path: '/presentation',
});

export default function PresentationPage() {
  return (
    <main className="px-6 py-24">
      {/* Intro */}
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Présentation</p>
        <h1 className="mt-6 font-montserrat text-4xl font-semibold md:text-5xl">
          Un savoir-faire au service de votre image
        </h1>
        <p className="mt-6 font-bodoni text-xl italic text-gray">
          Des solutions adaptées à chaque homme.
        </p>
      </section>

      {/* Le concept */}
      <section className="mx-auto mt-24 max-w-4xl">
        <h2 className="font-montserrat text-2xl font-semibold">Le concept</h2>
        <p className="mt-6 leading-relaxed text-gray">
          Une des seules professionnelles de la coiffure à proposer des solutions capillaires souvent
          vendues comme de simples perruques. L&apos;idée ici est de fournir un soin complet :
        </p>
        <ul className="mt-6 space-y-3 text-gray">
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Une écoute, un accompagnement personnalisé</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Une prothèse naturelle, discrète et adaptée aux besoins et aux budgets</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Une coupe professionnelle selon les envies</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Un suivi de qualité et une adaptation constante</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 text-bois">&#10003;</span>
            <span>Le tout dans une discrétion totale et un environnement privilégié</span>
          </li>
        </ul>
        <p className="mt-6 leading-relaxed text-gray">
          Au centre du concept : proposer des solutions en prothèse capillaire adaptées à chacun,
          qu&apos;elles soient standards ou personnalisées, selon les besoins, le mode de vie et les
          attentes. L&apos;objectif n&apos;est pas d&apos;imposer, mais de conseiller et
          d&apos;accompagner avec justesse.
        </p>
        <p className="mt-4 leading-relaxed text-gray">
          Parce que l&apos;image masculine est un ensemble harmonieux, l&apos;accompagnement peut
          inclure la mise en valeur de la barbe et des soins du visage ciblés, afin d&apos;assurer
          une cohérence globale.
        </p>
      </section>

      {/* Le lieu */}
      <section className="mt-20 px-6">
        {/* Mobile: full-bleed background with text overlay */}
        <div className="relative -mx-6 overflow-hidden px-6 py-24 md:hidden">
          <Image
            src="/assets/presentation-lieu-mobile.jpg"
            alt="L'institut KPIL'R Men à Orléans"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />
          <div className="relative z-10 mx-auto max-w-4xl">
            <h2 className="font-montserrat text-2xl font-semibold text-white">Le lieu</h2>
            <p className="mt-6 leading-relaxed text-white/85">
              Pensé comme un lieu intime et confidentiel, l&apos;institut est loin de l&apos;agitation
              d&apos;un salon traditionnel. Chaque rendez-vous se déroule dans une atmosphère élégante
              et apaisante, inspirée d&apos;un univers barber revisité.
            </p>
            <p className="mt-4 leading-relaxed text-white/85">
              Les tons blanc, noir et bois naturel créent un équilibre entre modernité, sobriété et
              chaleur, renforcé par une lumière douce qui accompagne chaque moment de soin.
            </p>
          </div>
        </div>

        {/* Desktop: split layout — text left, photo right */}
        <div className="mx-auto hidden max-w-6xl items-center gap-12 md:grid md:grid-cols-2">
          <div>
            <h2 className="font-montserrat text-2xl font-semibold">Le lieu</h2>
            <p className="mt-6 leading-relaxed text-gray">
              Pensé comme un lieu intime et confidentiel, l&apos;institut est loin de l&apos;agitation
              d&apos;un salon traditionnel. Chaque rendez-vous se déroule dans une atmosphère élégante
              et apaisante, inspirée d&apos;un univers barber revisité.
            </p>
            <p className="mt-4 leading-relaxed text-gray">
              Les tons blanc, noir et bois naturel créent un équilibre entre modernité, sobriété et
              chaleur, renforcé par une lumière douce qui accompagne chaque moment de soin.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src="/assets/presentation-lieu.jpg"
              alt="L'institut KPIL'R Men à Orléans"
              fill
              sizes="(max-width: 1024px) 50vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* La gerante */}
      <section className="mt-20 px-6">
        <div className="mx-auto max-w-6xl md:grid md:grid-cols-2 md:items-center md:gap-12">
          <div className="relative aspect-[5/4] w-full overflow-hidden">
            <Image
              src="/assets/presentation-gerante.jpg"
              alt="La gérante de KPIL'R Men, prothésiste capillaire à Orléans"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
          <div className="mt-8 md:mt-0">
            <h2 className="font-montserrat text-2xl font-semibold">La gérante</h2>
            <p className="mt-6 leading-relaxed text-gray">
              Forte de 23 ans d&apos;expérience dans la coiffure, elle a toujours eu à c&oelig;ur
              d&apos;évoluer et d&apos;affiner son expertise. Au fil des années, elle a identifié les
              besoins spécifiques des hommes : discrétion, écoute, compréhension et solutions réellement
              adaptées.
            </p>
            <p className="mt-4 leading-relaxed text-gray">
              C&apos;est cette vision qui l&apos;a conduite à créer KPIL&apos;R Men.
            </p>
          </div>
        </div>
      </section>

      {/* Les produits */}
      <section className="mt-20 bg-bois-light px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-montserrat text-2xl font-semibold">Les produits</h2>
          <p className="mt-6 leading-relaxed text-gray">
            L&apos;exigence passe aussi par le choix des produits : des gammes composées à 98%
            d&apos;ingrédients d&apos;origine naturelle. Ils sont sélectionnés soigneusement pour
            respecter la peau, préserver le cuir chevelu et protéger le complément capillaire. Tout
            en étant pratiques d&apos;utilisation pour l&apos;entretien au quotidien.
          </p>
          <p className="mt-4 leading-relaxed text-gray">
            Les partenaires sont clairs et transparents pour assurer une confiance totale.
          </p>
        </div>
      </section>

      {/* Conclusion */}
      <section className="mx-auto mt-20 max-w-4xl text-center">
        <p className="font-bodoni text-xl italic leading-relaxed text-gray">
          Chaque homme bénéficie d&apos;un moment personnel, d&apos;une écoute attentive et
          d&apos;un accompagnement précis dans un cadre raffiné et rassurant.
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
