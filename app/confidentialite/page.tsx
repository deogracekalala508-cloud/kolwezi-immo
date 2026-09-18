import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Politique de confidentialite',
  description:
    'Quelles donnees Humo Kolwezi collecte, pourquoi, combien de temps elles sont conservees et comment demander leur suppression.',
  alternates: { canonical: '/confidentialite' },
};

const maj = '15 septembre 2026';

export default function Confidentialite() {
  return (
    <div className="conteneur pb-20">
      <Breadcrumbs items={[{ label: 'Politique de confidentialite' }]} />

      <article className="max-w-lisible">
        <h1 className="text-3xl sm:text-4xl">Politique de confidentialite</h1>
        <p className="mt-2 text-sm text-ardoise/65">Derniere mise a jour : {maj}</p>

        <h2 className="mt-10 text-xl">Qui traite vos donnees</h2>
        <p className="mt-3 text-ardoise/90">
          {site.legalName}, {site.address.street}, {site.address.quartier}, {site.address.city},
          province du {site.address.region}, Republique democratique du Congo. Pour toute question :{' '}
          <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
        </p>

        <h2 className="mt-10 text-xl">Ce que nous collectons</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ardoise/90">
          <li>
            <strong>Formulaire de contact</strong> : nom, numero de telephone, adresse e-mail si vous
            la donnez, contenu de votre message et, le cas echeant, la reference du bien concerne.
          </li>
          <li>
            <strong>Mesure d audience</strong> : pages consultees, duree de visite, type d appareil et
            pays, via Google Analytics avec adresse IP anonymisee. Rien n est mesure tant que vous
            n avez pas accepte le bandeau.
          </li>
          <li>
            <strong>Journaux techniques</strong> : adresse IP conservee de facon temporaire pour
            limiter les envois automatises sur le formulaire.
          </li>
        </ul>
        <p className="mt-3 text-ardoise/90">
          Nous ne demandons jamais de documents d identite, de coordonnees bancaires ni de mot de
          passe par ce site.
        </p>

        <h2 className="mt-10 text-xl">Pourquoi nous les utilisons</h2>
        <p className="mt-3 text-ardoise/90">
          Uniquement pour repondre a votre demande, organiser une visite, assurer le suivi d une
          transaction, et comprendre quelles pages sont utiles afin d ameliorer le site. Vos donnees
          ne sont ni vendues ni louees.
        </p>

        <h2 className="mt-10 text-xl">Qui y a acces</h2>
        <p className="mt-3 text-ardoise/90">
          Les agents de l agence, ainsi que nos prestataires techniques : l hebergeur du site et
          Google pour la mesure d audience. Un notaire ou l administration foncière peut recevoir vos
          informations si vous engagez une transaction, avec votre accord.
        </p>

        <h2 className="mt-10 text-xl">Combien de temps</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ardoise/90">
          <li>Messages de contact sans suite : trois ans apres le dernier echange.</li>
          <li>Dossiers de transaction : dix ans, pour respecter nos obligations comptables.</li>
          <li>Statistiques de frequentation : quatorze mois.</li>
        </ul>

        <h2 className="mt-10 text-xl">Vos droits</h2>
        <p className="mt-3 text-ardoise/90">
          Vous pouvez demander a consulter, corriger ou supprimer vos donnees, ou retirer votre
          accord a la mesure d audience, en ecrivant a{' '}
          <a href={`mailto:${site.email}`} className="underline">{site.email}</a> ou en passant au
          bureau. Nous repondons sous trente jours. Pour la mesure d audience, vous pouvez aussi
          effacer les donnees de votre navigateur pour revoir le bandeau de consentement.
        </p>

        <h2 className="mt-10 text-xl">Cookies</h2>
        <p className="mt-3 text-ardoise/90">
          Le site fonctionne sans aucun cookie publicitaire. Seul Google Analytics depose des cookies
          de mesure, et seulement apres votre acceptation. Les refuser ne limite en rien l usage du
          site.
        </p>

        <h2 className="mt-10 text-xl">Securite des donnees</h2>
        <p className="mt-3 text-ardoise/90">
          Les messages sont stockes sur un serveur dont l acces est protege par mot de passe et par
          double authentification. Seuls les agents de l agence peuvent les consulter, et chacun ne
          voit que les dossiers qui le concernent. Les mots de passe sont conserves sous forme
          chiffree et irreversible : personne, chez nous, ne peut lire le votre. Les journaux
          techniques ne contiennent ni mot de passe ni code de verification. Le detail des mesures
          est publie dans le fichier SECURITY.md du site.
        </p>

        <h2 className="mt-10 text-xl">Photos publiees</h2>
        <p className="mt-3 text-ardoise/90">
          Les photos de biens sont prises par nos agents avec l accord du proprietaire. Nous evitons
          de photographier les personnes, les plaques d immatriculation et les numeros de parcelle
          lisibles. Si une photo vous concerne et que vous souhaitez son retrait, ecrivez-nous :
          elle sera retiree sous 48 heures.
        </p>

        <h2 className="mt-10 text-xl">Etudes de cas</h2>
        <p className="mt-3 text-ardoise/90">
          Les dossiers publies dans nos etudes de cas ne mentionnent jamais le nom complet d un
          client sans son accord ecrit. Nous utilisons une initiale (« Famille K. ») et nous
          retirons tout detail permettant d identifier un bien precis si le client le demande.
        </p>

        <h2 className="mt-10 text-xl">Modifications</h2>
        <p className="mt-3 text-ardoise/90">
          Toute evolution de cette politique sera publiee sur cette page avec une nouvelle date de
          mise a jour.
        </p>

        <p className="mt-10">
          <Link href="/contact" className="btn-contour">Poser une question sur vos donnees</Link>
        </p>
      </article>
    </div>
  );
}
