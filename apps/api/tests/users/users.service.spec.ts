import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../../../src/users/users.service';
import { PrismaService } from '../../../src/prisma/prisma.service';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  describe('findById()', () => {
    it('returns user when found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findById('user-1');
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
    });

    it('throws NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail()', () => {
    it('returns user when found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(result.email).toBe('test@example.com');
    });

    it('throws NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findByEmail('notfound@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create()', () => {
    it('creates a user with hashed password', async () => {
      const created = { ...mockUser, password: 'hashed' };
      mockPrisma.user.create.mockResolvedValue(created);
      const result = await service.create({ email: 'test@example.com', password: 'secret123', firstName: 'John', lastName: 'Doe' });
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result.email).toBe('test@example.com');
    });

    it('creates a user without password', async () => {
      const created = { ...mockUser };
      mockPrisma.user.create.mockResolvedValue(created);
      const result = await service.create({ email: 'test@example.com', firstName: 'John', lastName: 'Doe' });
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('updates user fields', async () => {
      const updated = { ...mockUser, firstName: 'Jane' };
      mockPrisma.user.update.mockResolvedValue(updated);
      const result = await service.update('user-1', { firstName: 'Jane' });
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result.firstName).toBe('Jane');
    });
  });

  describe('softDelete()', () => {
    it('sets deletedAt and isActive=false', async () => {
      const deleted = { ...mockUser, deletedAt: new Date(), isActive: false };
      mockPrisma.user.update.mockResolvedValue(deleted);
      await service.softDelete('user-1');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { deletedAt: expect.any(Date), isActive: false },
      });
    });
  });
});
