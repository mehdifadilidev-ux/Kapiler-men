import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { GalleryModule } from './gallery/gallery.module';
import { ServicesModule } from './services/services.module';
import { UploadModule } from './upload/upload.module';

// Initialize Firebase Admin SDK (only once)
if (getApps().length === 0 && process.env.FIREBASE_STORAGE_BUCKET) {
  let serviceAccount: Record<string, string> | undefined;

  // In production: read from env variable (JSON string)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
  // In dev: read from file path OR inline JSON
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const value = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
    if (value.startsWith('{')) {
      serviceAccount = JSON.parse(value);
    } else {
      const serviceAccountPath = resolve(value);
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
    }
  }

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    GalleryModule,
    ServicesModule,
    UploadModule,
  ],
})
export class AppModule {}
