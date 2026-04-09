import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from '../../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../src/prisma/prisma.service';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  profile: {
    create: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn((payload) => `signed-${payload.sub}`),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    passwordHash: '$2b$10$hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register()', () => {
    it('registers a new user and returns tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.profile.create.mockResolvedValue({});
      mockJwtService.sign.mockImplementation((p) => `signed-${p.sub}`);

      const dto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await service.register(dto);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockPrisma.profile.create).toHaveBeenCalledWith({ data: { userId: 'user-1' } });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('throws ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const dto = { email: 'test@example.com', password: 'password123', firstName: 'John', lastName: 'Doe' };

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login()', () => {
    it('returns tokens for valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockImplementation((p) => `signed-${p.sub}`);

      const result = await service.login('test@example.com', 'password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@example.com');
    });

    it('throws UnauthorizedException for unknown email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login('unknown@example.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, passwordHash: '$2b$10$validhash' });

      // bcrypt.compare will return false since password doesn't match the hash
      await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh()', () => {
    it('returns a new access token for a valid refresh token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'user-1', email: 'test@example.com', role: 'user' });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockImplementation((p) => `new-signed-${p.sub}`);

      const result = await service.refresh('valid-refresh-token');

      expect(result).toHaveProperty('accessToken');
      expect(mockJwtService.verify).toHaveBeenCalled();
    });

    it('throws UnauthorizedException for invalid refresh token', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('Invalid token'); });

      await expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException if user no longer exists', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'deleted-user', email: 'deleted@example.com', role: 'user' });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.refresh('valid-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout()', () => {
    it('returns a logout message', async () => {
      const result = await service.logout('some-refresh-token');
      expect(result).toEqual({ message: 'Logged out' });
    });
  });
});
