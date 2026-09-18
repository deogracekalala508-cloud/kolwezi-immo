# Securite - Humo Kolwezi

Ce document liste les mesures en place, celles qui restent a la charge de
l hebergeur, et la marche a suivre en cas d incident. Il est volontairement
lisible par un non-developpeur : l agence doit pouvoir le relire chaque annee.

## 1. Authentification

| Mesure | Ou c est implemente |
|---|---|
| Provider Credentials (e-mail + mot de passe) | `lib/auth.ts` |
| Hachage bcrypt a 12 tours | `prisma/seed.ts`, `lib/totp.ts` (codes de secours) |
| Comparaison factice quand le compte n existe pas | `lib/auth.ts`, `app/admin/login/actions.ts` |
| Session JWT limitee a 24 h | `lib/auth.ts` (`session.maxAge`, `jwt.maxAge`) |
| Cookie `httpOnly`, `sameSite=lax`, `secure` en production | `lib/auth.ts` (`cookies.sessionToken`) |
| `NEXTAUTH_SECRET` lu uniquement depuis l environnement | `lib/auth.ts` ; l application refuse de demarrer en production s il est absent |
| Message d erreur identique pour tous les echecs | aucune enumeration de comptes possible |

## 2. Double authentification (TOTP)

- Obligatoire : tant que `twoFactorEnabled` est faux, le jeton porte
  `twoFactorPending` et le middleware ne laisse acceder qu a `/admin/setup-2fa`.
- Secret genere par `otplib`, QR code produit cote serveur par `qrcode`
  (`lib/totp.ts`, `app/admin/setup-2fa/page.tsx`).
- Fenetre de tolerance d un pas de 30 secondes, pour les telephones dont
  l horloge derive un peu.
- Huit codes de secours a usage unique, affiches une seule fois, stockes haches
  en bcrypt. Un code consomme est retire de la liste.
- L etat reel est relu en base au rafraichissement de session
  (`callbacks.jwt`, `trigger === 'update'`) : le navigateur ne peut pas
  s auto-declarer conforme.

## 3. Limitation du nombre de tentatives

| Point d entree | Limite | Cle |
|---|---|---|
| `/admin/login` etape 1 | 5 / 15 min | IP **et** e-mail |
| `/api/auth/callback/credentials` | 5 / 15 min | e-mail |
| Activation de la 2FA | 5 / 15 min | identifiant de compte |
| `/api/contact` et Server Action de contact | 3 / heure | IP |

Implementation : `lib/rate-limit.ts`. Une connexion reussie rend ses essais au
compte. **Limite connue** : les compteurs vivent en memoire du processus. En
multi-instance (Vercel, cluster PM2), remplacer la `Map` par Upstash Redis ou
Vercel KV — l interface `createLimiter` ne change pas.

## 4. Controle d acces

- `middleware.ts` protege `/admin` et tout `/admin/*` sauf `/admin/login`.
- **Chaque** Server Action commence par `agentCourant()` ou `exigerAgent()`
  (`lib/admin.ts`) et s arrete avant toute ecriture si la session est absente
  ou incomplete. Le middleware seul ne suffirait pas : une Server Action est
  un point d entree HTTP a part entiere.
- Protection IDOR : `filtreProprietaire()` est injecte dans les `where` Prisma,
  et `peutModifierBien()` / `peutModifierEtude()` verifient la propriete avant
  toute modification. Un agent qui demande la fiche d un collegue obtient un
  404, pas un 403 : l existence de la ressource n est pas revelee.
- Double verrou sur les ecritures : verification prealable **et** filtre
  proprietaire dans la clause `where` de l `update`/`delete`.
- Le role `PROPRIETAIRE` voit tout ; le role `ADMIN` ne voit que ses fiches.
- `ownerId` vient toujours de la session, jamais d un champ de formulaire.

## 5. Validation des entrees

- Zod sur **tous** les formulaires, cote serveur (`lib/validations.ts`).
  La validation navigateur n est qu un confort d affichage.
- Les filtres du catalogue passent par `parseFilters()`, qui retombe sur des
  valeurs par defaut au lieu de planter sur une URL trafiquee.
- Identifiants valides par `idSchema` (format cuid) avant toute requete.
- Le prix est stocke en cents (entier) : pas d arrondi flottant sur de l argent.

## 6. Envoi de fichiers (`lib/uploads.ts`)

1. Taille : 5 Mo maximum, refus au-dela.
2. Type declare : JPEG, PNG, WebP, AVIF uniquement.
3. **Type reel** : les premiers octets du fichier sont relus (signature
   binaire). Un `.php` renomme en `.jpg` est rejete, car le navigateur ment.
4. Extension derivee du type reel, jamais du nom fourni : plus de double
   extension (`photo.jpg.php`).
5. Nom de fichier normalise, debarrasse des separateurs de chemin et de
   l unicode piege, suffixe d un UUID : pas de traversee de repertoire ni
   d ecrasement de fichier existant.
6. Ecriture dans `public/uploads` en mode `0644`, jamais executable.

## 7. En-tetes HTTP (`next.config.js`)

`Content-Security-Policy` (avec `frame-ancestors 'none'`, `object-src 'none'`),
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
restrictive, `Strict-Transport-Security` avec preload. `unsafe-eval` n est
autorise qu en developpement, pour le rechargement a chaud.

## 8. Journalisation et messages d erreur

- `lib/log.ts` filtre systematiquement les champs sensibles : mot de passe,
  hachage, secret TOTP, code, jeton, cookie, en-tete d autorisation. Le filtre
  s applique meme si un appelant les transmet par erreur.
- Les piles d appel ne sont journalisees qu en developpement.
- `messageErreurPublic()` renvoie au navigateur une phrase utile et neutre en
  production ; le detail technique reste cote serveur.
- Sont journalises : echecs de connexion, blocages du limiteur, usage d un code
  de secours, tentatives d acces hors perimetre, creations et suppressions.

## 9. Formulaire public

- Champ piege (honeypot) invisible : une soumission qui le remplit recoit une
  reponse de succes sans rien enregistrer.
- Validation Zod du numero RDC, avec normalisation au format `+243...`.
- Aucune donnee bancaire ni piece d identite n est demandee par le site.

## 10. Ce qui reste a la charge de l exploitant

1. HTTPS obligatoire et redirection HTTP -> HTTPS au niveau de l hebergeur.
2. Changer les mots de passe du seed avant la mise en ligne.
3. Sauvegarder `prisma/dev.db` (ou la base Postgres) **et** `public/uploads/`,
   qui n est pas dans Git.
4. Passer le limiteur sur Redis en deploiement multi-instance.
5. Rotation annuelle de `NEXTAUTH_SECRET` (deconnecte toutes les sessions).
6. Mises a jour de dependances : `npm audit` une fois par mois.
7. Garder une copie papier des codes de secours 2FA hors du bureau.

## 11. Signaler une faille

Ecrire a `contact@humokolwezi.cd` avec « securite » en objet. Merci de laisser
un delai raisonnable avant toute publication. Aucune poursuite ne sera engagee
contre une personne signalant une faille de bonne foi, sans exfiltration de
donnees ni degradation de service.
