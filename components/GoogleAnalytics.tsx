'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ki-consentement-mesure';

/**
 * Google Analytics 4 avec Consent Mode v2 : le consentement est refuse par
 * defaut, aucun cookie de mesure n'est depose tant que le visiteur n'a pas
 * accepte. Le bandeau reste discret et ne bloque pas la lecture.
 */
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const [choix, setChoix] = useState<'accepte' | 'refuse' | null>(null);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    const stocke = window.localStorage.getItem(STORAGE_KEY);
    if (stocke === 'accepte' || stocke === 'refuse') setChoix(stocke);
    setPret(true);
  }, []);

  function decider(valeur: 'accepte' | 'refuse') {
    window.localStorage.setItem(STORAGE_KEY, valeur);
    setChoix(valeur);
    window.gtag?.('consent', 'update', {
      analytics_storage: valeur === 'accepte' ? 'granted' : 'denied',
    });
  }

  if (!gaId) return null;

  return (
    <>
      <Script
        id="ga-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
            var c = null;
            try { c = window.localStorage.getItem('${STORAGE_KEY}'); } catch (e) {}
            if (c === 'accepte') { gtag('consent', 'update', { analytics_storage: 'granted' }); }
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {pret && choix === null && (
        <div
          role="dialog"
          aria-label="Mesure d audience"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-nuit/15 bg-white p-4 shadow-[0_-8px_24px_-16px_rgba(10,35,66,.4)] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-sm sm:rounded-lg sm:border"
        >
          <p className="text-sm">
            Nous mesurons la frequentation du site pour l ameliorer. Aucun cookie n est depose
            sans votre accord.{' '}
            <a href="/confidentialite" className="font-semibold text-nuit-600 underline">
              En savoir plus
            </a>
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => decider('accepte')} className="btn-or flex-1 py-2 text-sm">
              Accepter
            </button>
            <button type="button" onClick={() => decider('refuse')} className="btn-contour flex-1 py-2 text-sm">
              Refuser
            </button>
          </div>
        </div>
      )}
    </>
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
