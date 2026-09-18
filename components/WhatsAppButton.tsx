import { MessageCircle } from 'lucide-react';
import { whatsappLink, generalMessage } from '@/lib/whatsapp';

/**
 * CTA WhatsApp permanent : pastille flottante sur mobile (la ou 90 % du trafic
 * arrive), bouton texte a partir de sm. Place au-dessus de tout le contenu.
 */
export default function WhatsAppButton({ message = generalMessage }: { message?: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ecrire a Humo Kolwezi sur WhatsApp"
      className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-[#128C7E] px-4 py-3.5 font-semibold text-white shadow-lg transition-colors hover:bg-[#0f7a6d]"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="hidden sm:inline">Ecrire sur WhatsApp</span>
    </a>
  );
}
