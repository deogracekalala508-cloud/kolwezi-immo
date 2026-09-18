import Image from 'next/image';
import { Phone } from 'lucide-react';

export type TeamEntry = {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  phone: string | null;
};

export default function TeamSection({ members }: { members: TeamEntry[] }) {
  if (members.length === 0) return null;

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <li key={m.id} className="flex gap-4 rounded-lg bg-white p-5 shadow-carte ring-1 ring-nuit/5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-nuit-50">
            <Image
              src={m.photo}
              alt={`Portrait de ${m.name}, ${m.role.toLowerCase()} chez Humo Kolwezi`}
              fill
              sizes="80px"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="text-lg">{m.name}</h3>
            <p className="text-sm font-medium text-cuivre">{m.role}</p>
            <p className="mt-2 text-sm text-ardoise/85">{m.bio}</p>
            {m.phone && (
              <a
                href={`tel:${m.phone.replace(/\s/g, '')}`}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-nuit hover:underline"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {m.phone}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
