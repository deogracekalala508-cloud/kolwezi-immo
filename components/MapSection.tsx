import { MapPin, Navigation, Clock } from 'lucide-react';
import { site } from '@/lib/site';

const adresseComplete = `${site.address.street}, ${site.address.quartier}, ${site.address.city}, RDC`;
const itineraire = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adresseComplete)}`;
const carte = `https://www.google.com/maps?q=${encodeURIComponent(adresseComplete)}&z=14&output=embed`;

export default function MapSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
      <div>
        <h2 className="text-2xl sm:text-3xl">Venir au bureau</h2>
        <p className="mt-3 max-w-lisible text-ardoise/85">
          Nous recevons sans rendez-vous sur l avenue Manika, entre la station Engen et le marche
          central. Pour une visite de bien, prevenez-nous la veille : un agent vous accompagne sur place.
        </p>
        <ul className="mt-5 space-y-3 text-sm">
          <li className="flex gap-2">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cuivre" aria-hidden="true" />
            <span>{adresseComplete}</span>
          </li>
          <li className="flex gap-2">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-cuivre" aria-hidden="true" />
            <span>{site.hours}</span>
          </li>
        </ul>
        <a
          href={itineraire}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-or mt-5"
        >
          <Navigation className="h-5 w-5" aria-hidden="true" />
          Ouvrir l itineraire
        </a>
      </div>

      <div className="overflow-hidden rounded-lg ring-1 ring-nuit/10">
        <iframe
          src={carte}
          title="Carte de localisation du bureau de Humo Kolwezi, avenue Manika a Kolwezi"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[320px] w-full border-0 sm:h-[420px]"
        />
      </div>
    </div>
  );
}
