import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

function getRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is required.');
  }
  return secret;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required.');
  }
  return secret;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(dto: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');
    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : null;
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    await this.prisma.profile.create({ data: { userId: user.id } });
    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: getRefreshSecret(),
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      const storedToken = await this.prisma.refreshToken.findFirst({
        where: { userId: user.id, token: refreshToken, expiresAt: { gt: new Date() } },
      });
      if (!storedToken) throw new UnauthorizedException('Refresh token revoked');
      // Invalidate old token (rotation)
      await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
      const tokens = await this.generateTokens(user);
      await this.storeRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    return { message: 'Logged out successfully' };
  }

  async handleGoogleCallback(code: string) {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID || '';
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback';

      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });

      const { access_token } = tokenResponse.data;
      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { email, given_name, family_name } = userInfoResponse.data;
      let user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await this.prisma.user.create({
          data: { email, firstName: given_name || 'User', lastName: family_name || '' },
        });
        await this.prisma.profile.create({ data: { userId: user.id } });
      }

      const tokens = await this.generateTokens(user);
      await this.storeRefreshToken(user.id, tokens.refreshToken);
      return {
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Google OAuth failed');
    }
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: getRefreshSecret(),
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async verifyToken(token: string) {
    return this.jwtService.verify(token, { secret: getJwtSecret() });
  }

  private async storeRefreshToken(userId: string, token: string) {
    // Store with 7-day expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }
}
