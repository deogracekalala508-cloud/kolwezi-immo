import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  page,
  total,
  construireLien,
}: {
  page: number;
  total: number;
  construireLien: (page: number) => string;
}) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === total || Math.abs(p - page) <= 1,
  );

  return (
    <nav aria-label="Pagination du catalogue" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link
          href={construireLien(page - 1)}
          rel="prev"
          aria-label="Page precedente"
          className="rounded-md border border-nuit/20 bg-white p-2.5 text-nuit"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
      )}

      {pages.map((p, index) => {
        const precedent = pages[index - 1];
        const saut = precedent !== undefined && p - precedent > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {saut && <span className="px-1 text-nuit/40">…</span>}
            <Link
              href={construireLien(p)}
              aria-current={p === page ? 'page' : undefined}
              className={
                p === page
                  ? 'rounded-md bg-nuit px-4 py-2.5 font-semibold text-white'
                  : 'rounded-md border border-nuit/20 bg-white px-4 py-2.5 text-nuit'
              }
            >
              {p}
            </Link>
          </span>
        );
      })}

      {page < total && (
        <Link
          href={construireLien(page + 1)}
          rel="next"
          aria-label="Page suivante"
          className="rounded-md border border-nuit/20 bg-white p-2.5 text-nuit"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
