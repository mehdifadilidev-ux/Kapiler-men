import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const serviceAccountPath = resolve(process.env.FIREBASE_SERVICE_ACCOUNT ?? './firebase-service-account.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
if (!storageBucket) {
  throw new Error('FIREBASE_STORAGE_BUCKET is not defined');
}

initializeApp({
  credential: cert(serviceAccount),
  storageBucket,
});

async function setupCors() {
  const bucket = getStorage().bucket();

  await bucket.setCorsConfiguration([
    {
      origin: ['*'],
      method: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      maxAgeSeconds: 3600,
      responseHeader: ['Content-Type', 'Authorization'],
    },
  ]);

  console.log('✅ CORS configured on bucket:', bucket.name);
}

setupCors().catch((err) => {
  console.error('❌ CORS setup failed:', err);
  process.exit(1);
});
