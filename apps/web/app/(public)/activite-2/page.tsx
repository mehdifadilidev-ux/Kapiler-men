import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activite 2',
  description: 'Bientot disponible — nouvelle activite KPIL R Men.',
};

export default function Activite2Page() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-montserrat text-4xl font-semibold">Bientot disponible</h1>
      <p className="mt-4 max-w-md text-gray">
        Cette activite est en cours de preparation. Revenez bientot pour en savoir plus.
      </p>
    </main>
  );
}
