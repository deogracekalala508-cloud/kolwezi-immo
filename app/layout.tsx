import type { Metadata, Viewport } from 'next';
import { Archivo, Public_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { site } from '@/lib/site';

// Archivo : grotesque large et solide pour les titres.
// Public Sans : dessinee pour rester lisible en petit corps sur ecran modeste.
const display = Archivo({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700'],
  variable: '--font-display',
});

const body = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Humo Kolwezi | Maisons, parcelles et vehicules a Kolwezi',
    template: '%s | Humo Kolwezi',
  },
  description:
    'Agence immobiliere a Kolwezi : maisons, parcelles et vehicules verifies avant mise en vente. Visite accompagnee et titres controles au cadastre du Lualaba.',
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  keywords: [
    'Humo Kolwezi',
    'achat immobilier Kolwezi',
    'maison a vendre Kolwezi',
    'parcelle a vendre Kolwezi',
    'vehicule occasion Lualaba',
    'agence immobiliere Lualaba RDC',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_CD',
    siteName: site.name,
    url: site.url,
    title: 'Humo Kolwezi | Maisons, parcelles et vehicules a Kolwezi',
    description:
      'Maisons, parcelles et vehicules a vendre a Kolwezi, avec verification des titres avant chaque mise en vente.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Humo Kolwezi, agence immobiliere a Kolwezi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Humo Kolwezi',
    description: 'Maisons, parcelles et vehicules a vendre a Kolwezi.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0A2342',
  width: 'device-width',
  initialScale: 1,
};

const organisationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': `${site.url}/#agence`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  telephone: `+${site.whatsapp}`,
  email: site.email,
  image: `${site.url}/og-default.png`,
  priceRange: '$$',
  areaServed: { '@type': 'City', name: 'Kolwezi' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  openingHours: 'Mo-Sa 08:00-18:00',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">
        <a href="#contenu" className="lien-saut">
          Aller au contenu principal
        </a>
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <GoogleAnalytics gaId={site.gaId} />
      </body>
    </html>
  );
}
