'use client';

import { useEffect, useRef } from 'react';

export default function RendezVousPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const planityKey = process.env.NEXT_PUBLIC_PLANITY_KEY;
    if (!planityKey) return;

    // Configure Planity widget on window
    Object.assign(window, {
      planity: {
        key: planityKey,
        primaryColor: '#BB7348',
        container: containerRef.current,
      },
    });

    // Load Planity scripts
    const scripts = [
      'https://d2skjte8udjqxw.cloudfront.net/widget/production/2/polyfills.latest.js',
      'https://d2skjte8udjqxw.cloudfront.net/widget/production/2/app.latest.js',
    ];

    const scriptElements: HTMLScriptElement[] = [];

    for (const src of scripts) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      scriptElements.push(script);
    }

    return () => {
      for (const script of scriptElements) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="font-montserrat text-4xl font-semibold">Prendre rendez-vous</h1>
      <p className="mt-4 text-gray">
        Choisissez votre soin et reservez directement en ligne.
      </p>
      <div ref={containerRef} className="mt-12 min-h-[600px]" />
    </main>
  );
}
