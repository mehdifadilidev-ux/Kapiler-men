import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ZodExceptionFilter } from './common/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Cookie parser for HTTP-only refresh tokens
  app.use(cookieParser());

  // CORS — support multiple origins (comma-separated) + Vercel previews
  app.enableCors({
    origin: (origin, callback) => {
      const allowed = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim());

      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow exact match
      if (allowed.includes(origin)) return callback(null, true);
      // Allow all Vercel preview URLs
      if (origin.endsWith('.vercel.app')) return callback(null, true);

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Global Zod exception filter
  app.useGlobalFilters(new ZodExceptionFilter());

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}/api`);
}

bootstrap();
