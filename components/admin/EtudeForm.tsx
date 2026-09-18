'use client';

import { useFormState } from 'react-dom';
import { enregistrerEtude } from '@/app/admin/actions';
import type { EtatAction } from '@/lib/admin';
import SubmitButton from './SubmitButton';
import Alerte from './Alerte';

export type ValeursEtude = {
  id?: string;
  title: string;
  client: string;
  category: string;
  location: string;
  challenge: string;
  approach: string;
  result: string;
  metric: string;
  image: string;
  imageAlt: string;
  published: boolean;
  order: number;
};

const VIDE: ValeursEtude = {
  title: '',
  client: '',
  category: 'MAISON',
  location: '',
  challenge: '',
  approach: '',
  result: '',
  metric: '',
  image: '',
  imageAlt: '',
  published: true,
  order: 0,
};

export default function EtudeForm({ valeurs = VIDE }: { valeurs?: ValeursEtude }) {
  const [etat, action] = useFormState<EtatAction, FormData>(enregistrerEtude, {});
  const champ = (nom: string) => etat.champs?.[nom];
  const suffixe = valeurs.id ?? 'new';

  return (
    <form action={action} encType="multipart/form-data" className="space-y-4">
      {valeurs.id && <input type="hidden" name="id" value={valeurs.id} />}
      <input type="hidden" name="imageActuelle" value={valeurs.image} />

      <Alerte etat={{ ...etat, message: 'Etude de cas enregistree.' }} />

      <div>
        <label htmlFor={`title-${suffixe}`} className="etiquette">Titre</label>
        <input
          id={`title-${suffixe}`}
          name="title"
          required
          maxLength={140}
          defaultValue={valeurs.title}
          placeholder="Vendre une villa du quartier Golf en trois semaines"
          className="champ"
        />
        {champ('title') && <p className="erreur">{champ('title')}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`client-${suffixe}`} className="etiquette">Client</label>
          <input
            id={`client-${suffixe}`}
            name="client"
            required
            maxLength={80}
            defaultValue={valeurs.client}
            placeholder="Famille K."
            className="champ"
          />
          <p className="mt-1 text-sm text-ardoise/65">
            Initiale seulement, sauf accord ecrit de la personne.
          </p>
          {champ('client') && <p className="erreur">{champ('client')}</p>}
        </div>

        <div>
          <label htmlFor={`category-${suffixe}`} className="etiquette">Categorie</label>
          <select id={`category-${suffixe}`} name="category" defaultValue={valeurs.category} className="champ">
            <option value="MAISON">Maison</option>
            <option value="PARCELLE">Parcelle</option>
            <option value="VEHICULE">Vehicule</option>
          </select>
        </div>

        <div>
          <label htmlFor={`location-${suffixe}`} className="etiquette">Localisation</label>
          <input
            id={`location-${suffixe}`}
            name="location"
            required
            maxLength={120}
            defaultValue={valeurs.location}
            className="champ"
          />
        </div>

        <div>
          <label htmlFor={`metric-${suffixe}`} className="etiquette">Resultat chiffre</label>
          <input
            id={`metric-${suffixe}`}
            name="metric"
            required
            maxLength={60}
            defaultValue={valeurs.metric}
            placeholder="Vendu en 21 jours"
            className="champ"
          />
          {champ('metric') && <p className="erreur">{champ('metric')}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={`challenge-${suffixe}`} className="etiquette">La situation de depart</label>
        <textarea
          id={`challenge-${suffixe}`}
          name="challenge"
          rows={3}
          required
          minLength={30}
          defaultValue={valeurs.challenge}
          className="champ"
        />
        {champ('challenge') && <p className="erreur">{champ('challenge')}</p>}
      </div>

      <div>
        <label htmlFor={`approach-${suffixe}`} className="etiquette">Ce que l agence a fait</label>
        <textarea
          id={`approach-${suffixe}`}
          name="approach"
          rows={3}
          required
          minLength={30}
          defaultValue={valeurs.approach}
          className="champ"
        />
        {champ('approach') && <p className="erreur">{champ('approach')}</p>}
      </div>

      <div>
        <label htmlFor={`result-${suffixe}`} className="etiquette">L issue</label>
        <textarea
          id={`result-${suffixe}`}
          name="result"
          rows={3}
          required
          minLength={30}
          defaultValue={valeurs.result}
          className="champ"
        />
        {champ('result') && <p className="erreur">{champ('result')}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`fichier-${suffixe}`} className="etiquette">
            Photo {valeurs.image && <span className="font-normal text-ardoise/60">(laisser vide pour garder l actuelle)</span>}
          </label>
          <input
            id={`fichier-${suffixe}`}
            name="fichier"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="w-full text-sm"
          />
          {champ('image') && <p className="erreur">{champ('image')}</p>}
        </div>

        <div>
          <label htmlFor={`imageAlt-${suffixe}`} className="etiquette">Texte alternatif</label>
          <input
            id={`imageAlt-${suffixe}`}
            name="imageAlt"
            required
            maxLength={160}
            defaultValue={valeurs.imageAlt}
            className="champ"
          />
          {champ('imageAlt') && <p className="erreur">{champ('imageAlt')}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div className="max-w-[140px]">
          <label htmlFor={`order-${suffixe}`} className="etiquette">Ordre</label>
          <input
            id={`order-${suffixe}`}
            name="order"
            type="number"
            min={0}
            max={999}
            defaultValue={valeurs.order}
            className="champ"
          />
        </div>

        <label className="flex items-center gap-2 pb-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={valeurs.published}
            className="h-5 w-5 rounded border-nuit/30"
          />
          <span className="font-medium text-nuit">Publiee</span>
        </label>
      </div>

      <SubmitButton variante={valeurs.id ? 'contour' : 'or'}>
        {valeurs.id ? 'Enregistrer les modifications' : 'Publier l etude de cas'}
      </SubmitButton>
    </form>
  );
}
