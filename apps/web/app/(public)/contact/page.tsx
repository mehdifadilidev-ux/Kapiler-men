import type { Metadata } from 'next';
import Link from 'next/link';
import { BOOKING_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Contactez KPIL'R Men, institut de prothese capillaire a Orleans. 64 Quai des Augustins, 45100 Orleans.",
  openGraph: {
    title: 'Contact | KPIL R Men',
    description: 'Coordonnees et horaires',
  },
};

const HOURS = [
  { day: 'Lundi', hours: '9h30 - 19h00' },
  { day: 'Mardi', hours: '9h30 - 16h00' },
  { day: 'Mercredi', hours: 'Ferme' },
  { day: 'Jeudi', hours: '9h30 - 19h00' },
  { day: 'Vendredi', hours: '9h30 - 19h00' },
  { day: 'Samedi', hours: '9h00 - 18h00' },
  { day: 'Dimanche', hours: 'Ferme' },
] as const;

export default function ContactPage() {
  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Intro */}
        <section className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Contact</p>
          <h1 className="mt-6 font-montserrat text-4xl font-semibold md:text-5xl">
            Nous contacter
          </h1>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 leading-relaxed text-gray">
          <p>
            L&apos;institut KPIL&apos;R Men fonctionne exclusivement sur rendez-vous afin de
            garantir un accompagnement personnalise et un moment privilegie.
          </p>
          <p>
            Pour des raisons de confidentialite et de qualite de service, un seul client est
            accueilli a la fois.
          </p>
          <p>
            L&apos;accueil a l&apos;institut se fait personnellement a l&apos;heure du rendez-vous.
          </p>
          <p>
            Merci de respecter l&apos;horaire convenu afin d&apos;assurer le bon deroulement des
            rendez-vous suivants.
          </p>
        </section>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {/* Coordonnees */}
          <div>
            <h2 className="font-montserrat text-xl font-semibold">Coordonnees</h2>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="font-semibold">Adresse</p>
                <p className="text-gray">64 Quai des Augustins</p>
                <p className="text-gray">45100 Orleans</p>
              </div>
              <div>
                <p className="font-semibold">Telephone</p>
                <p className="text-gray">06 66 97 25 62</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray">kpilr-men@outlook.fr</p>
              </div>
            </div>

            {/* WhatsApp + Social */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="https://wa.me/33666972562"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-bois px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
              >
                WhatsApp
              </Link>
              <Link
                href="https://www.instagram.com/kpilr_men/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-bois px-6 py-3 text-xs font-semibold uppercase tracking-widest text-bois transition-colors hover:bg-bois-light"
              >
                Instagram
              </Link>
              <Link
                href="https://www.tiktok.com/@kpilr_men"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-bois px-6 py-3 text-xs font-semibold uppercase tracking-widest text-bois transition-colors hover:bg-bois-light"
              >
                TikTok
              </Link>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h2 className="font-montserrat text-xl font-semibold">Horaires</h2>
            <div className="mt-6 divide-y divide-bois-light">
              {HOURS.map((item) => (
                <div key={item.day} className="flex justify-between py-3 text-sm">
                  <span className="font-medium">{item.day}</span>
                  <span className={item.hours === 'Ferme' ? 'text-gray' : ''}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <section className="mt-16">
          <h2 className="font-montserrat text-xl font-semibold">Nous trouver</h2>
          <div className="mt-6 aspect-video w-full overflow-hidden border border-bois-light">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2692.5!2d1.9037!3d47.9008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s64+Quai+des+Augustins%2C+45100+Orl%C3%A9ans!5e0!3m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="KPIL'R Men - 64 Quai des Augustins, Orleans"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-bois px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-bois/90"
          >
            Prendre rendez-vous
          </a>
        </section>
      </div>
    </main>
  );
}
