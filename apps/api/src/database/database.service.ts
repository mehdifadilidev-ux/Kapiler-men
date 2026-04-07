import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import postgres from 'postgres';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  public readonly sql: postgres.Sql;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }
    this.sql = postgres(databaseUrl);
  }

  async onModuleDestroy() {
    await this.sql.end();
  }
}
