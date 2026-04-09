import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(dto: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: passwordHash, firstName: dto.firstName, lastName: dto.lastName },
    });
    await this.prisma.profile.create({ data: { userId: user.id } });
    const tokens = await this.generateTokens(user);
    return { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.generateTokens(user);
    return { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }, ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret' });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
      return { accessToken };
    } catch { throw new UnauthorizedException('Invalid refresh token'); }
  }

  async logout(refreshToken: string) {
    // In production: add to Redis denylist
    return { message: 'Logged out' };
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret', expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}
