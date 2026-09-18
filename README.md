# Humo Kolwezi

Site vitrine, catalogue et espace agence pour un agent immobilier de Kolwezi
(province du Lualaba, RDC). Maisons, parcelles et vehicules.

Next.js 14 (App Router) · TypeScript strict · Tailwind · Prisma + SQLite ·
NextAuth avec double authentification · Zod · Lucide.

---

## 1. Installation

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Le site public tourne sur http://localhost:3000, l espace agence sur
http://localhost:3000/admin.

**Premiere connexion** : les identifiants sont ceux de `.env`
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`). Vous serez redirige vers
`/admin/setup-2fa` pour scanner un QR code avec Google Authenticator, Aegis ou
2FAS. Tant que cette etape n est pas faite, aucune autre page admin n est
accessible. Notez vos huit codes de secours : ils ne sont affiches qu une fois.

Le seed cree deux comptes, pour que le cloisonnement entre agents soit visible :

| Compte | Role | Voit |
|---|---|---|
| `ADMIN_EMAIL` | PROPRIETAIRE | toutes les fiches de l agence |
| `AGENT_EMAIL` | ADMIN | uniquement les fiches qu il a creees |

## 2. Variables d environnement

| Variable | Role | Obligatoire |
|---|---|---|
| `DATABASE_URL` | Connexion Prisma (`file:./dev.db` en local) | oui |
| `NEXTAUTH_SECRET` | Signature des jetons de session. `openssl rand -base64 32` | oui — l app refuse de demarrer en production sans lui |
| `NEXTAUTH_URL` | URL de base pour les redirections d authentification | oui en production |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numero au format international sans `+` (ex. `243971234567`) | oui |
| `NEXT_PUBLIC_SITE_URL` | URL publique, sans slash final. Sert au sitemap et a l Open Graph | oui |
| `NEXT_PUBLIC_GA_ID` | Identifiant Google Analytics 4. Vide = aucun tracking | non |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Compte proprietaire cree par le seed | au seed |
| `AGENT_EMAIL` / `AGENT_PASSWORD` | Second compte agent | non |

`.env` ne doit jamais etre commite. `.env.example` sert de modele.

## 3. Deux contraintes SQLite

SQLite ne gere ni les enums Prisma ni les listes de scalaires :

| Champ voulu | Implementation | Ou c est controle |
|---|---|---|
| `category`, `status` (enum) | `String` | `lib/validations.ts` (Zod) |
| `images: String[]` | `String` contenant du JSON | `lib/images.ts` |

Le prix est stocke en **cents** (`price: Int`) pour eviter les arrondis :
185 000 USD s ecrit `185_000_00`. L affichage passe par `formatPrice()`, la
saisie admin se fait en dollars entiers et la conversion est faite dans la
Server Action.

**Passer a PostgreSQL** : changer `provider` dans `prisma/schema.prisma`,
convertir `category`/`status` en `enum` et `images` en `Json`, puis
`npx prisma migrate dev`.

## 4. Structure

```
app/
  page.tsx                  accueil (hero, services, vedettes, avis,
                            etudes de cas, FAQ, equipe, carte)
  biens/                    catalogue filtre + fiche detaillee
  etudes-de-cas/            liste + dossier detaille
  contact/ merci/ faq/ confidentialite/ not-found.tsx
  sitemap.ts                sitemap dynamique lu depuis Prisma
  api/contact/route.ts      point d entree JSON, limite a 3 messages/heure
  api/auth/[...nextauth]/   NextAuth
  admin/
    login/                  connexion en deux etapes (mot de passe, puis TOTP)
    setup-2fa/              configuration du QR code
    dashboard/              statistiques + tableau des biens + messages
    biens/nouveau/          creation avec envoi d images
    biens/[id]/editer/      edition
    messages/ temoignages/ faq/ etudes-de-cas/
components/                 composants publics
components/admin/           formulaires et navigation de l espace agence
lib/
  auth.ts admin.ts totp.ts  authentification, garde-fous, 2FA
  uploads.ts log.ts         fichiers, journalisation sans secrets
  rate-limit.ts validations.ts images.ts whatsapp.ts site.ts prisma.ts
middleware.ts               protege /admin/* sauf /admin/login
```

## 5. Commandes

| Commande | Effet |
|---|---|
| `npm install` | Installe les dependances et genere le client Prisma |
| `npx prisma migrate dev` | Cree la base et applique le schema |
| `npm run seed` | Charge les donnees de demonstration |
| `npm run dev` | Serveur de developpement |
| `npm run build` | Build de production |
| `npm run start` | Sert le build |
| `npm run typecheck` | Verification TypeScript sans emission |
| `npm run lint` | ESLint |
| `npm run db:studio` | Prisma Studio, pour inspecter la base |

## 6. Deploiement

### Vercel

1. Pousser le depot, importer le projet sur Vercel.
2. Renseigner toutes les variables du tableau ci-dessus dans « Environment
   Variables ». `NEXTAUTH_URL` = l URL de production.
3. **Changer `DATABASE_URL` pour une base Postgres** (Neon, Supabase, Vercel
   Postgres) : le systeme de fichiers de Vercel est ephemere, une base SQLite y
   serait effacee a chaque deploiement.
4. Meme probleme pour `public/uploads` : brancher un stockage objet (Vercel
   Blob, S3, Cloudflare R2) dans `lib/uploads.ts`, en gardant les memes
   controles de type et de taille.
5. Remplacer la `Map` de `lib/rate-limit.ts` par Upstash Redis : sur Vercel,
   chaque instance a sa propre memoire, donc ses propres compteurs.

### Serveur classique (VPS, Docker)

SQLite convient si le site tourne sur une seule instance. Prevoir alors :
`npm run build && npm run start` derriere Nginx en HTTPS, et une sauvegarde
quotidienne de `prisma/dev.db` **et** de `public/uploads/`.

## 7. Avant la mise en ligne

1. Placer une image de partage `public/og-default.png` (1200 × 630).
2. Remplacer l URL du sitemap dans `public/robots.txt` par le domaine reel.
3. Changer les mots de passe du seed et activer la 2FA sur chaque compte.
4. Remplacer les photos Unsplash du seed par les vraies photos des biens, puis
   retirer `images.unsplash.com` de `next.config.js`.
5. Relire `SECURITY.md`, notamment la section « a la charge de l exploitant ».
6. Verifier le rendu sur un telephone d entree de gamme : 90 % des visiteurs
   arrivent depuis un mobile.

## 8. Securite

Le detail des mesures est dans [SECURITY.md](./SECURITY.md) : 2FA obligatoire,
sessions de 24 h, limitation des tentatives, protection IDOR, validation Zod
systematique, controle binaire des fichiers envoyes, en-tetes HTTP et
journalisation sans secrets.
