import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from '../database/database.service';
import type { AdminProfile, AuthTokens } from '@kpil/shared';

interface AdminRow {
  id: string;
  email: string;
  password: string;
}

interface RefreshTokenRow {
  id: string;
  admin_id: string;
  token: string;
  expires_at: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<AuthTokens> {
    const [admin] = await this.db.sql<AdminRow[]>`
      SELECT id, email, password FROM admins WHERE email = ${email}
    `;

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens({ id: admin.id, email: admin.email });
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const [tokenRow] = await this.db.sql<RefreshTokenRow[]>`
      SELECT id, admin_id, token, expires_at FROM refresh_tokens
      WHERE token = ${refreshToken} AND expires_at > NOW()
    `;

    if (!tokenRow) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Delete the used refresh token (rotation)
    await this.db.sql`DELETE FROM refresh_tokens WHERE id = ${tokenRow.id}`;

    const [admin] = await this.db.sql<AdminRow[]>`
      SELECT id, email FROM admins WHERE id = ${tokenRow.admin_id}
    `;

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    return this.generateTokens({ id: admin.id, email: admin.email });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.db.sql`DELETE FROM refresh_tokens WHERE token = ${refreshToken}`;
  }

  private async generateTokens(admin: AdminProfile): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign({ sub: admin.id, email: admin.email });

    const refreshToken = uuid();
    const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');
    const days = parseInt(refreshExpiration, 10) || 7;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await this.db.sql`
      INSERT INTO refresh_tokens (admin_id, token, expires_at)
      VALUES (${admin.id}, ${refreshToken}, ${expiresAt})
    `;

    return { accessToken, refreshToken };
  }
}
