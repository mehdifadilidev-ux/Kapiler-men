import postgres from 'postgres';
import 'dotenv/config';

interface Soin {
  section: string;
  title: string;
  price: number;
  duration: string | null;
  features: string[];
  description: string | null;
}

const SOINS: Soin[] = [
  // Image masculine - Barbe & Visage
  {
    section: 'Image masculine - Barbe & Visage',
    title: 'Rituel barbe personnalise',
    price: 40,
    duration: '40 min',
    features: [
      'Protocole adapte a la sensibilite de la peau et a la nature du poil.',
      'Selection de produits specifiques selon epaisseur, densite et reactivite cutanee.',
    ],
    description: null,
  },
  {
    section: 'Image masculine - Barbe & Visage',
    title: 'Taille & contours barbe (tondeuse)',
    price: 15,
    duration: '15 min',
    features: [],
    description: "Prestations proposees aux clients de l'institut.",
  },
  {
    section: 'Image masculine - Barbe & Visage',
    title: 'Rituel bien-etre visage',
    price: 50,
    duration: '45 min',
    features: ['Nettoyage doux, masque adapte, hydratation.'],
    description: "Integre a l'experience KPIL'R Men.",
  },
  {
    section: 'Image masculine - Barbe & Visage',
    title: 'Option epilation zone visage',
    price: 5,
    duration: null,
    features: [],
    description: "Prestations proposees aux clients de l'institut.",
  },
  // Diagnostic & Bilan capillaire
  {
    section: 'Diagnostic & Bilan capillaire',
    title: 'Diagnostic & bilan capillaire personnalise',
    price: 50,
    duration: '40 min',
    features: [
      "Realise a l'institut.",
      'Deduit du montant total en cas de transformation.',
      "Permet d'etablir un devis personnalise et de definir la solution capillaire adaptee.",
    ],
    description:
      "Un premier echange d'informations peut egalement etre realise a distance (WhatsApp ou telephone) afin d'evaluer la situation capillaire. Cet echange n'est pas facture.",
  },
  // Transformations capillaires
  {
    section: 'Transformations capillaires',
    title: 'Transformation "Essentielle"',
    price: 450,
    duration: '2 h 40',
    features: [
      'Diagnostic personnalise inclus.',
      'Prothese capillaire adaptee.',
      'Fixation personnalisee (adhesif ou colle).',
      "Pose du complement capillaire, coupe d'integration, coiffage personnalise.",
    ],
    description:
      'Transformation realisee apres diagnostic capillaire et validation du devis personnalise.',
  },
  {
    section: 'Transformations capillaires',
    title: 'Transformation "Signature"',
    price: 480,
    duration: '2 h 40',
    features: [
      'Diagnostic personnalise inclus.',
      'Prothese texture specifique.',
      'Fixation personnalisee (adhesif ou colle).',
      "Pose du complement capillaire, coupe d'integration et coiffage personnalise.",
    ],
    description:
      'Transformation realisee apres diagnostic capillaire et validation du devis personnalise.',
  },
  {
    section: 'Transformations capillaires',
    title: 'Transformation "Texture Afro"',
    price: 520,
    duration: '3 h',
    features: [
      'Diagnostic personnalise inclus.',
      'Prothese texture afro.',
      'Fixation personnalisee (adhesif ou colle).',
      "Pose du complement capillaire, coupe d'integration, coiffage personnalise.",
    ],
    description:
      'Transformation realisee apres diagnostic capillaire et validation du devis personnalise.',
  },
  // Entretien du complement
  {
    section: 'Entretien du complement',
    title: 'Entretien / fixation',
    price: 90,
    duration: '1 h 40',
    features: [
      'Depose du complement et nettoyage du cuir chevelu.',
      'Entretien du complement capillaire et fixation personnalisee.',
      'Repose du complement, coupe et coiffage personnalise.',
    ],
    description:
      'Cette prestation peut etre realisee sur tout complement capillaire, quelle que soit sa provenance.',
  },
  {
    section: 'Entretien du complement',
    title: 'Entretien bordure frontale',
    price: 15,
    duration: '15 min',
    features: [],
    description: null,
  },
  {
    section: 'Entretien du complement',
    title: 'Coupe des cotes uniquement',
    price: 20,
    duration: '20 min',
    features: [],
    description: null,
  },
  {
    section: 'Entretien du complement',
    title: 'Coloration contour',
    price: 30,
    duration: '35 min',
    features: [],
    description: null,
  },
  // Renouvellements
  {
    section: 'Renouvellements',
    title: 'Renouvellement "Essentiel"',
    price: 420,
    duration: '2 h 40',
    features: [
      'Depose, nettoyage du cuir chevelu et fixation personnalisee.',
      'Pose du complement capillaire, coupe technique, coiffage personnalise.',
    ],
    description: null,
  },
  {
    section: 'Renouvellements',
    title: 'Renouvellement "Signature"',
    price: 450,
    duration: '2 h 40',
    features: [
      'Depose, nettoyage du cuir chevelu et fixation personnalisee.',
      'Pose du complement capillaire, coupe technique et coiffage personnalise.',
    ],
    description: null,
  },
  {
    section: 'Renouvellements',
    title: 'Renouvellement "Texture Afro"',
    price: 490,
    duration: '3 h',
    features: [
      'Depose, nettoyage du cuir chevelu et fixation personnalisee.',
      'Pose du complement capillaire, coupe technique, coiffage personnalise.',
    ],
    description: null,
  },
];

async function seed(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = postgres(databaseUrl);

  const [existing] = await sql<{ count: string }[]>`SELECT COUNT(*)::text as count FROM services`;
  console.log(`Existing services: ${existing?.count ?? '0'}`);

  const [maxRow] = await sql<{ max: number | null }[]>`SELECT MAX(position) as max FROM services`;
  let position = (maxRow?.max ?? -1) + 1;

  let inserted = 0;
  for (const soin of SOINS) {
    const [existingTitle] = await sql<{ id: string }[]>`
      SELECT id FROM services WHERE title = ${soin.title} LIMIT 1
    `;
    if (existingTitle) {
      console.log(`⏭️  Skipping "${soin.title}" (already exists)`);
      continue;
    }

    await sql`
      INSERT INTO services (title, description, features, duration, price, section, is_active, position)
      VALUES (
        ${soin.title},
        ${soin.description},
        ${soin.features},
        ${soin.duration},
        ${soin.price},
        ${soin.section},
        true,
        ${position}
      )
    `;
    console.log(`✅ ${soin.section} → ${soin.title}`);
    position++;
    inserted++;
  }

  await sql.end();
  console.log(`\n🎉 Inserted ${inserted}/${SOINS.length} services`);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
