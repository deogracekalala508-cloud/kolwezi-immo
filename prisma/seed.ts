import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const img = (id: string, alt: string) => ({
  url: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`,
  alt,
});

const properties = [
  {
    title: 'Villa 4 chambres avec cour muree, Quartier Latin',
    slug: 'villa-4-chambres-quartier-latin',
    category: 'MAISON',
    price: 185_000_00,
    location: 'Quartier Latin, Kolwezi',
    featured: true,
    status: 'DISPONIBLE',
    description:
      "Villa de plain-pied sur une parcelle de 800 m2, entierement muree avec portail metallique. Quatre chambres dont une suite parentale, salon traversant, cuisine equipee et depandance de deux pieces pour le personnel. Raccordement SNEL et forage avec cuve de 5000 litres : l'eau ne manque jamais. A dix minutes du centre-ville par l'avenue Manika.",
    images: [
      img('1600596542815-ffad4c1539a9', 'Facade de la villa et son portail metallique au Quartier Latin'),
      img('1600585154340-be6161a56a0c', 'Salon traversant lumineux de la villa'),
      img('1600607687939-ce8a6c25118c', 'Cuisine equipee avec plan de travail en granit'),
    ],
  },
  {
    title: 'Maison 3 chambres renovee, Manika',
    slug: 'maison-3-chambres-manika',
    category: 'MAISON',
    price: 92_000_00,
    location: 'Manika, Kolwezi',
    featured: true,
    status: 'DISPONIBLE',
    description:
      'Maison familiale renovee en 2024 : toiture neuve, electricite refaite aux normes, carrelage dans toutes les pieces. Trois chambres, salon, cuisine interieure et douche exterieure. Parcelle de 450 m2 avec manguier et espace pour un garage. Quartier calme, ecole primaire et marche a moins de 500 metres.',
    images: [
      img('1568605114967-8130f3a36994', 'Maison renovee de trois chambres a Manika vue de la rue'),
      img('1560448204-e02f11c3d0e2', 'Chambre principale carrelee avec fenetre sur la cour'),
    ],
  },
  {
    title: 'Appartement 2 chambres, centre-ville',
    slug: 'appartement-2-chambres-centre-ville',
    category: 'MAISON',
    price: 54_000_00,
    location: 'Centre-ville, Kolwezi',
    featured: true,
    status: 'RESERVE',
    description:
      "Appartement au premier etage d'un immeuble de quatre logements, a deux pas des banques et de la Gecamines. Deux chambres, sejour, cuisine et balcon donnant sur l'avenue. Parking ferme pour deux vehicules. Ideal pour un cadre expatrie ou un premier achat locatif.",
    images: [img('1522708323590-d24dbb6b0267', "Sejour de l'appartement avec acces au balcon")],
  },
  {
    title: 'Parcelle 1000 m2 viabilisee, route de Musonoi',
    slug: 'parcelle-1000m2-musonoi',
    category: 'PARCELLE',
    price: 38_000_00,
    location: 'Musonoi, Kolwezi',
    featured: true,
    status: 'DISPONIBLE',
    description:
      "Parcelle rectangulaire de 25 x 40 metres, bornee et delimitee par un mur de cloture sur trois cotes. Certificat d'enregistrement en regle, verifie au Cadastre du Lualaba. Terrain plat, sans zone inondable, raccordable au reseau SNEL a 60 metres. Acces goudronne jusqu'a l'entree.",
    images: [img('1500382017468-9049fed747ef', 'Parcelle plate et bornee de 1000 m2 sur la route de Musonoi')],
  },
  {
    title: 'Parcelle 500 m2 avec titre foncier, Dilala',
    slug: 'parcelle-500m2-dilala',
    category: 'PARCELLE',
    price: 19_500_00,
    location: 'Dilala, Kolwezi',
    featured: true,
    status: 'DISPONIBLE',
    description:
      "Parcelle de 500 m2 dans un lotissement recent de Dilala, avec certificat d'enregistrement au nom du vendeur. Voisinage residentiel deja construit, rue en terre praticable toute l'annee. Bon rapport surface-prix pour une premiere construction.",
    images: [img('1464146072230-91cabc968266', 'Terrain residentiel de 500 m2 dans un lotissement a Dilala')],
  },
  {
    title: 'Toyota Land Cruiser Prado 2016, 4x4 diesel',
    slug: 'toyota-land-cruiser-prado-2016',
    category: 'VEHICULE',
    price: 27_500_00,
    location: 'Kolwezi',
    featured: true,
    status: 'DISPONIBLE',
    description:
      "Land Cruiser Prado importe de Dubai, 142 000 km au compteur, moteur diesel 3.0 D-4D. Entretien suivi, pneus tout-terrain changes en 2025, climatisation revisee. Dedouanement complet, documents en regle. Le vehicule de reference pour les pistes du Lualaba.",
    images: [img('1533473359331-0135ef1b58bf', 'Toyota Land Cruiser Prado 2016 blanc vu de trois quarts avant')],
  },
  {
    title: 'Toyota Hilux double cabine 2019',
    slug: 'toyota-hilux-double-cabine-2019',
    category: 'VEHICULE',
    price: 31_000_00,
    location: 'Kolwezi',
    featured: false,
    status: 'DISPONIBLE',
    description:
      'Pick-up Hilux double cabine, 98 000 km, boite manuelle, benne avec hard-top. Vehicule de societe entretenu en garage agree, carnet disponible. Convient aux sous-traitants miniers comme aux transporteurs.',
    images: [img('1552519507-da3b142c6e3d', 'Pick-up Toyota Hilux double cabine gris avec hard-top')],
  },
  {
    title: 'Maison 5 chambres avec piscine, Golf',
    slug: 'maison-5-chambres-golf',
    category: 'MAISON',
    price: 310_000_00,
    location: 'Golf, Kolwezi',
    featured: false,
    status: 'VENDU',
    description:
      "Propriete de standing sur 1200 m2 au quartier Golf : cinq chambres, double salon, bureau, piscine et groupe electrogene de 15 kVA. Vendue en mars 2026 a une famille de cadres miniers, en trois semaines.",
    images: [img('1613490493576-7fde63acd811', 'Villa de standing avec piscine au quartier Golf')],
  },
  {
    title: 'Parcelle commerciale 300 m2, avenue Manika',
    slug: 'parcelle-commerciale-300m2-manika',
    category: 'PARCELLE',
    price: 45_000_00,
    location: 'Avenue Manika, Kolwezi',
    featured: false,
    status: 'DISPONIBLE',
    description:
      "Parcelle d'angle de 300 m2 sur l'avenue Manika, l'axe commercant le plus frequente de Kolwezi. Zonage commercial, ideale pour un depot, une quincaillerie ou un immeuble de boutiques. Facade de 15 metres sur la voie goudronnee.",
    images: [img('1486406146926-c627a92ad1ab', "Parcelle d'angle a vocation commerciale sur l'avenue Manika")],
  },
  {
    title: 'Studio meuble, Quartier Latin',
    slug: 'studio-meuble-quartier-latin',
    category: 'MAISON',
    price: 28_000_00,
    location: 'Quartier Latin, Kolwezi',
    featured: false,
    status: 'DISPONIBLE',
    description:
      "Studio meuble de 35 m2 dans une residence securisee avec gardien 24h/24. Livre avec lit, climatiseur, plaque de cuisson et chauffe-eau. Rentabilite locative solide grace a la demande des travailleurs miniers en mission.",
    images: [img('1522708323590-d24dbb6b0267', 'Studio meuble avec coin nuit et climatiseur')],
  },
  {
    title: 'Nissan Navara 2017, boite automatique',
    slug: 'nissan-navara-2017',
    category: 'VEHICULE',
    price: 22_000_00,
    location: 'Kolwezi',
    featured: false,
    status: 'RESERVE',
    description:
      'Nissan Navara automatique, 115 000 km, quatre roues motrices enclenchables. Carrosserie saine, interieur cuir, attelage de remorque installe. Reserve jusqu au 30 du mois, contactez-nous pour etre prevenu si la vente ne se conclut pas.',
    images: [img('1552519507-da3b142c6e3d', 'Nissan Navara 2017 gris metallise')],
  },
  {
    title: 'Parcelle agricole 2 hectares, peripherie de Kolwezi',
    slug: 'parcelle-agricole-2-hectares',
    category: 'PARCELLE',
    price: 26_000_00,
    location: 'Route de Kanzenze, Kolwezi',
    featured: false,
    status: 'DISPONIBLE',
    description:
      "Deux hectares de terre arable a vingt minutes du centre, le long de la route de Kanzenze. Point d'eau naturel en bordure, sol rouge adapte au mais et au manioc. Documents coutumiers et administratifs disponibles pour consultation.",
    images: [img('1500382017468-9049fed747ef', 'Terrain agricole de deux hectares en peripherie de Kolwezi')],
  },
];

const testimonials = [
  {
    clientName: 'Josephine Mwamba',
    rating: 5,
    content:
      "J'ai achete ma parcelle a Dilala en trois semaines. L'agence a fait verifier le certificat d'enregistrement au cadastre avant que je verse le moindre dollar. C'est exactement ce que je cherchais : de la prudence.",
  },
  {
    clientName: 'Patrick Ilunga',
    rating: 5,
    content:
      "Je travaille sur un site minier et je ne suis a Kolwezi qu'un week-end sur deux. Les visites ont ete organisees le samedi matin, avec photos et video envoyees par WhatsApp entre-temps. Maison signee en deux mois.",
  },
  {
    clientName: 'Fabrice Kabongo',
    rating: 4,
    content:
      "Vente de ma villa au quartier Golf. Le prix conseille etait en dessous de mes attentes au depart, mais le raisonnement etait juste : trois offres recues le premier mois.",
  },
  {
    clientName: 'Nadine Tshala',
    rating: 5,
    content:
      "Achat d'un Land Cruiser via l'agence. Les papiers de dedouanement etaient complets et verifies devant moi. Aucune mauvaise surprise a la mutation du vehicule.",
  },
];

const faq = [
  {
    order: 1,
    question: "Comment verifiez-vous qu'une parcelle est bien en regle ?",
    answer:
      "Avant toute mise en ligne, nous demandons le certificat d'enregistrement et nous le faisons confirmer au bureau du Cadastre du Lualaba. Nous verifions aussi l'absence de litige coutumier aupres du chef de quartier. Un bien dont les papiers ne sont pas clairs ne figure pas sur ce site.",
  },
  {
    order: 2,
    question: 'Quels sont vos frais ?',
    answer:
      "Pour un acheteur, la visite et l'accompagnement sont gratuits. Notre commission est payee par le vendeur : 5 % du prix de vente pour un bien immobilier, 3 % pour un vehicule. Les frais de mutation et les taxes restent a la charge de l'acheteur, nous vous en donnons le montant estime avant de signer.",
  },
  {
    order: 3,
    question: 'Puis-je payer en francs congolais ?',
    answer:
      "Les prix sont affiches en dollars americains, comme c'est l'usage a Kolwezi. Le paiement en francs congolais est possible au taux du jour de la Banque centrale, a convenir par ecrit avec le vendeur avant la signature.",
  },
  {
    order: 4,
    question: 'Organisez-vous des visites pour les personnes hors de Kolwezi ?',
    answer:
      'Oui. Nous filmons une visite complete du bien et vous l envoyons par WhatsApp, avec un appel video en direct si vous le souhaitez pour poser vos questions sur place. Beaucoup de nos clients travaillent a Lubumbashi ou a l etranger.',
  },
  {
    order: 5,
    question: 'Combien de temps prend une vente ?',
    answer:
      "Comptez trois a six semaines entre l'accord sur le prix et la remise des cles : negociation, verification des documents, redaction de l'acte chez le notaire et mutation. Une parcelle va generalement plus vite qu'une maison habitee.",
  },
  {
    order: 6,
    question: 'Gerez-vous aussi la location ?',
    answer:
      'Nous proposons la gestion locative pour les proprietaires qui vivent hors de Kolwezi : recherche du locataire, encaissement du loyer et suivi des reparations, contre 8 % du loyer mensuel.',
  },
];

const team = [
  {
    order: 1,
    name: 'Jeef Kasika',
    role: 'Fondateur et agent principal',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=70',
    bio: "Quinze ans dans l'immobilier a Kolwezi, apres huit annees comme topographe pour un operateur minier. Il connait le cadastre du Lualaba dossier par dossier et conduit lui-meme les verifications de titres.",
    phone: '+243 97 000 00 01',
  },
  {
    order: 2,
    name: 'Grace Kasongo',
    role: 'Responsable des ventes',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=70',
    bio: "Elle accompagne les acheteurs de la premiere visite a la remise des cles, en francais et en swahili. Specialiste des dossiers pour clients bases a Lubumbashi ou a l'etranger.",
    phone: '+243 97 000 00 02',
  },
  {
    order: 3,
    name: 'Serge Nkulu',
    role: 'Vehicules et logistique',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=70',
    bio: "Ancien chef d'atelier, il inspecte chaque vehicule avant sa mise en vente et controle les documents de dedouanement avec le client.",
    phone: '+243 97 000 00 03',
  },
];

const etudes = [
  {
    order: 1,
    slug: 'villa-golf-vendue-en-21-jours',
    title: 'Vendre une villa du quartier Golf en trois semaines',
    client: 'Famille K.',
    category: 'MAISON',
    location: 'Golf, Kolwezi',
    metric: 'Vendue en 21 jours, au prix demande',
    challenge:
      "La famille partait s'installer a Lubumbashi et avait deja signe un bail la-bas. Leur villa de cinq chambres etait en vente depuis sept mois avec une autre agence, a 380 000 USD, sans une seule offre. Chaque mois de vacance leur coutait le gardiennage, le groupe electrogene et l'entretien de la piscine.",
    approach:
      "Nous avons commence par une estimation contradictoire : trois ventes comparables au Golf sur douze mois donnaient une fourchette de 300 a 320 000 USD. Le prix a ete ramene a 310 000 USD, ce que le vendeur a d'abord mal pris. Nous avons refait les photos en fin de journee, quand la lumiere passe sur la terrasse, et redige une annonce qui parlait du groupe electrogene de 15 kVA plutot que du nombre de metres carres : c'est ce qui compte pour un cadre minier. Trois visites groupees ont ete organisees le meme samedi.",
    result:
      "Trois offres sont arrivees dans le mois, dont deux au prix. La vente a ete signee chez le notaire vingt et un jours apres la mise en ligne, a 310 000 USD. Le vendeur a recupere l'equivalent de six mois de frais de vacance, soit plus que la difference avec son prix initial.",
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=70',
    imageAlt: 'Villa de standing avec piscine au quartier Golf a Kolwezi',
  },
  {
    order: 2,
    slug: 'parcelle-musonoi-litige-coutumier-resolu',
    title: "Debloquer une parcelle de Musonoi bloquee par un litige coutumier",
    client: 'Monsieur I.',
    category: 'PARCELLE',
    location: 'Musonoi, Kolwezi',
    metric: 'Dossier assaini en 6 semaines, vente a 38 000 USD',
    challenge:
      "Le proprietaire detenait un certificat d'enregistrement en regle, mais une famille du quartier revendiquait un droit coutumier sur la bande nord du terrain. Deux acheteurs s'etaient retires en apprenant l'existence du differend. Le bien etait invendable en l'etat, et le vendeur envisageait de brader a moitie prix.",
    approach:
      "Nous avons refuse de mettre le terrain en ligne tant que le dossier n'etait pas propre. Verification du certificat au Cadastre du Lualaba, puis trois reunions avec le chef de quartier et la famille concernee, en presence d'un notaire. Un proces-verbal de renonciation a ete signe contre une indemnite convenue, financee par le vendeur. Le bornage a ete refait par un geometre et les nouveaux proces-verbaux joints au dossier de vente.",
    result:
      "La parcelle a ete mise en ligne six semaines plus tard, avec le dossier complet consultable des la premiere visite. Elle s'est vendue a 38 000 USD, soit le prix du marche, a un acheteur qui a pu verifier chaque piece avant de payer. Aucun recours depuis.",
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=70',
    imageAlt: 'Parcelle bornee sur la route de Musonoi, au sud de Kolwezi',
  },
  {
    order: 3,
    slug: 'achat-a-distance-depuis-lubumbashi',
    title: 'Acheter une maison a Kolwezi sans quitter Lubumbashi',
    client: 'Monsieur et Madame T.',
    category: 'MAISON',
    location: 'Manika, Kolwezi',
    metric: 'Achat conclu en 2 mois, 2 deplacements seulement',
    challenge:
      "Le couple travaillait a Lubumbashi et voulait acheter a Kolwezi pour preparer une mutation. Six cents kilometres de route les separaient du marche, et un aller-retour leur coutait deux jours de conge. Ils avaient deja perdu un acompte sur une annonce Facebook qui s'est revelee fictive.",
    approach:
      "Nous avons filme chaque bien retenu en visite complete, sans montage ni angle flatteur, avec un appel video en direct pour repondre a leurs questions sur place. Pour les trois maisons de la selection finale, nous avons envoye les copies des certificats d'enregistrement et le releve du cadastre avant toute discussion de prix. L'acompte n'a ete verse qu'entre les mains du notaire, jamais a l'agence.",
    result:
      "Deux deplacements ont suffi : une journee de visites pour la selection finale, une demi-journee pour la signature. La maison de trois chambres a Manika a ete achetee 92 000 USD en deux mois. Le couple nous a depuis adresse deux de leurs collegues.",
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=70',
    imageAlt: 'Maison familiale renovee de trois chambres dans le quartier Manika',
  },
  {
    order: 4,
    slug: 'land-cruiser-dedouanement-verifie',
    title: 'Un Land Cruiser au dossier verifie plutot qu au prix casse',
    client: 'Madame T.',
    category: 'VEHICULE',
    location: 'Kolwezi',
    metric: 'Mutation obtenue en 9 jours, sans redressement',
    challenge:
      "L'acheteuse avait repere un Prado 2016 a 4 000 USD sous le prix du marche chez un vendeur particulier. Le vehicule etait sain, mais les documents de dedouanement presentaient une incoherence sur le numero de chassis : un risque de saisie a la premiere mutation.",
    approach:
      "Notre responsable vehicules a compare la plaque du chassis, la declaration d'importation et le certificat de dedouanement, ligne par ligne, devant la cliente. L'ecart venait d'une erreur de saisie a l'importation, corrigeable mais a la charge du vendeur. Nous lui avons deconseille ce vehicule et propose un Prado equivalent, plus cher de 3 200 USD, dont le dossier etait complet.",
    result:
      "La mutation a ete obtenue en neuf jours, sans redressement ni frais imprevu. Le vehicule initial a ete immobilise deux mois plus tard chez un autre acheteur, le temps de la regularisation. La difference de prix aura coute moins cher que l'immobilisation.",
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=70',
    imageAlt: 'Toyota Land Cruiser Prado blanc, vehicule de reference sur les pistes du Lualaba',
  },
];

async function main() {
  console.log('Nettoyage des tables...');
  await prisma.contactMessage.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.property.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.user.deleteMany();

  const email = process.env.ADMIN_EMAIL ?? 'admin@humokolwezi.cd';
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMoi2026!';

  // bcrypt en 12 tours. La 2FA n'est volontairement PAS pre-activee : le secret
  // TOTP doit etre genere sur l'appareil de l'agent, jamais dans un script.
  const admin = await prisma.user.create({
    data: {
      email,
      name: 'Jeef Kasika',
      passwordHash: await bcrypt.hash(password, 12),
      role: 'PROPRIETAIRE',
      twoFactorEnabled: false,
    },
  });
  console.log(`Proprietaire cree : ${email} (2FA a configurer a la premiere connexion)`);

  const agent = await prisma.user.create({
    data: {
      email: process.env.AGENT_EMAIL ?? 'grace@humokolwezi.cd',
      name: 'Grace Kasongo',
      passwordHash: await bcrypt.hash(process.env.AGENT_PASSWORD ?? 'ChangeMoiAussi2026!', 12),
      role: 'ADMIN',
      twoFactorEnabled: false,
    },
  });
  console.log(`Agent cree : ${agent.email}`);

  // Les fiches sont reparties entre les deux comptes pour que le cloisonnement
  // anti-IDOR soit visible des la premiere connexion.
  for (const [index, p] of properties.entries()) {
    const { images, ...rest } = p;
    await prisma.property.create({
      data: {
        ...rest,
        currency: 'USD',
        images: JSON.stringify(images),
        ownerId: index % 3 === 0 ? agent.id : admin.id,
      },
    });
  }
  console.log(`${properties.length} biens crees`);

  for (const e of etudes) {
    await prisma.caseStudy.create({ data: { ...e, ownerId: admin.id } });
  }
  console.log(`${etudes.length} etudes de cas creees`);

  await prisma.testimonial.createMany({ data: testimonials });
  await prisma.faqItem.createMany({ data: faq });
  await prisma.teamMember.createMany({ data: team });

  await prisma.contactMessage.create({
    data: {
      name: 'Client de demonstration',
      phone: '+243971234567',
      email: 'demo@example.cd',
      message: 'Message de demonstration cree par le seed pour tester la boite de reception.',
    },
  });

  console.log('Seed termine.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
