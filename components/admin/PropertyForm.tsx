'use client';

import { useFormState } from 'react-dom';
import { useState } from 'react';
import Image from 'next/image';
import { Trash2, ImagePlus } from 'lucide-react';
import { creerBien, modifierBien } from '@/app/admin/biens/actions';
import type { EtatAction } from '@/lib/admin';
import type { PropertyImage } from '@/lib/images';
import SubmitButton from './SubmitButton';
import Alerte from './Alerte';

export type ValeursBien = {
  id?: string;
  title: string;
  description: string;
  category: string;
  status: string;
  price: number; // en dollars entiers
  location: string;
  featured: boolean;
  images: PropertyImage[];
};

const VIDE: ValeursBien = {
  title: '',
  description: '',
  category: 'MAISON',
  status: 'DISPONIBLE',
  price: 0,
  location: '',
  featured: false,
  images: [],
};

export default function PropertyForm({ valeurs = VIDE }: { valeurs?: ValeursBien }) {
  const edition = Boolean(valeurs.id);
  const [etat, action] = useFormState<EtatAction, FormData>(
    edition ? modifierBien : creerBien,
    {},
  );

  const [existantes, setExistantes] = useState<PropertyImage[]>(valeurs.images);
  const [nouvelles, setNouvelles] = useState<number[]>(existantes.length === 0 ? [0] : []);

  const champ = (nom: string) => etat.champs?.[nom];

  return (
    <form action={action} encType="multipart/form-data" className="space-y-6">
      {edition && <input type="hidden" name="id" value={valeurs.id} />}

      <Alerte etat={{ erreur: etat.erreur, ok: etat.ok, message: 'Bien enregistre.' }} />

      <div>
        <label htmlFor="title" className="etiquette">Titre de l annonce</label>
        <input
          id="title"
          name="title"
          required
          maxLength={140}
          defaultValue={valeurs.title}
          placeholder="Villa 4 chambres avec cour muree, Quartier Latin"
          className="champ"
        />
        {champ('title') && <p className="erreur">{champ('title')}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="etiquette">Categorie</label>
          <select id="category" name="category" defaultValue={valeurs.category} className="champ">
            <option value="MAISON">Maison</option>
            <option value="PARCELLE">Parcelle</option>
            <option value="VEHICULE">Vehicule</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="etiquette">Statut</label>
          <select id="status" name="status" defaultValue={valeurs.status} className="champ">
            <option value="DISPONIBLE">Disponible</option>
            <option value="RESERVE">Reserve</option>
            <option value="VENDU">Vendu</option>
          </select>
        </div>

        <div>
          <label htmlFor="price" className="etiquette">Prix en dollars</label>
          <input
            id="price"
            name="price"
            type="number"
            min={1}
            step={100}
            required
            inputMode="numeric"
            defaultValue={valeurs.price || ''}
            className="champ"
          />
          {champ('price') && <p className="erreur">{champ('price')}</p>}
        </div>

        <div>
          <label htmlFor="location" className="etiquette">Quartier ou localisation</label>
          <input
            id="location"
            name="location"
            required
            maxLength={120}
            defaultValue={valeurs.location}
            placeholder="Manika, Kolwezi"
            className="champ"
          />
          {champ('location') && <p className="erreur">{champ('location')}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="etiquette">Description</label>
        <textarea
          id="description"
          name="description"
          rows={8}
          required
          minLength={40}
          maxLength={5000}
          defaultValue={valeurs.description}
          placeholder="Surface, nombre de pieces, etat des documents, acces a l eau et a l electricite, voisinage."
          className="champ"
        />
        {champ('description') && <p className="erreur">{champ('description')}</p>}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={valeurs.featured}
          className="h-5 w-5 rounded border-nuit/30"
        />
        <span className="font-medium text-nuit">Mettre en vedette sur la page d accueil</span>
      </label>

      {/* ------------------------------ Photos ------------------------------ */}
      <fieldset className="rounded-lg border border-nuit/15 p-4">
        <legend className="px-2 font-display font-semibold text-nuit">Photos</legend>
        <p className="text-sm text-ardoise/70">
          JPEG, PNG, WebP ou AVIF. 5 Mo maximum par photo, douze photos au total. Rien n est
          supprime ou ajoute tant que vous n avez pas clique sur « Enregistrer » en bas de page :
          vous pouvez corriger une erreur avant de valider.
        </p>

        {existantes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-nuit">
              Photos actuelles ({existantes.length})
            </h3>
            <ul className="mt-2 space-y-3">
              {existantes.map((image, index) => (
                <li key={`${image.url}-${index}`} className="flex gap-3 rounded-md bg-nuit-50 p-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
                    <Image src={image.url} alt="" fill sizes="80px" className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1">
                    <input type="hidden" name="imageUrl" value={image.url} />
                    <label className="etiquette text-sm" htmlFor={`alt-${index}`}>
                      Description de la photo
                    </label>
                    <input
                      id={`alt-${index}`}
                      name="imageAlt"
                      defaultValue={image.alt}
                      maxLength={160}
                      className="champ py-2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setExistantes((liste) => liste.filter((_, i) => i !== index))}
                    className="inline-flex h-fit shrink-0 items-center gap-1.5 self-start rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-ardoise/60">
              Une photo supprimee ici disparait du site des que vous enregistrez. Pensez a
              ajouter une photo de remplacement avant de valider si vous ne voulez pas laisser le
              bien sans image.
            </p>
          </div>
        )}

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-nuit">Ajouter de nouvelles photos</h3>
          <ul className="mt-2 space-y-3">
            {nouvelles.map((rang) => (
              <li key={rang} className="grid gap-2 rounded-md border border-dashed border-nuit/25 p-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`fichier-${rang}`} className="etiquette text-sm">
                    Choisir une photo sur l appareil
                  </label>
                  <input
                    id={`fichier-${rang}`}
                    name="fichiers"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="w-full text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`fichierAlt-${rang}`} className="etiquette text-sm">
                    Description de la photo
                  </label>
                  <input
                    id={`fichierAlt-${rang}`}
                    name="fichierAlt"
                    maxLength={160}
                    placeholder="Facade de la maison vue de la rue"
                    className="champ py-2"
                  />
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setNouvelles((liste) => [...liste, (liste.at(-1) ?? -1) + 1])}
            className="btn-contour mt-4 py-2 text-sm"
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            Ajouter une photo
          </button>
        </div>

        {champ('images') && <p className="erreur">{champ('images')}</p>}
      </fieldset>

      <SubmitButton>{edition ? 'Enregistrer les modifications' : 'Publier le bien'}</SubmitButton>
    </form>
  );
}
