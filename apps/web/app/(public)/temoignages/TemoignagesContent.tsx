'use client';

export function TemoignagesContent() {
  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.5em] text-gray">Temoignages</p>
        <h1 className="mt-6 font-montserrat text-4xl font-semibold">
          Ils nous ont fait confiance
        </h1>
        <p className="mt-4 text-gray">
          Decouvrez les avis de nos clients sur Google et Planity.
        </p>
      </div>

      {/* Google Reviews widget placeholder */}
      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="font-montserrat text-2xl font-semibold">Avis Google</h2>
        <div className="mt-6 flex min-h-[300px] items-center justify-center border border-bois-light bg-bois-light">
          <p className="text-sm text-gray">Widget Google Reviews — bientot disponible</p>
        </div>
      </section>

      {/* Planity Reviews widget placeholder */}
      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="font-montserrat text-2xl font-semibold">Avis Planity</h2>
        <div className="mt-6 flex min-h-[300px] items-center justify-center border border-bois-light bg-bois-light">
          <p className="text-sm text-gray">Widget Planity Reviews — bientot disponible</p>
        </div>
      </section>
    </main>
  );
}
