import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/auth/register (POST)', () => {
    it('registers a new user and returns tokens', async () => {
      const uniqueEmail = `e2e-test-${Date.now()}@example.com`;
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'TestPassword123!',
          firstName: 'E2E',
          lastName: 'Test',
        })
        .expect(201);

      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body.user.email).toBe(uniqueEmail);
    });

    it('returns 409 when email already exists', async () => {
      const uniqueEmail = `duplicate-${Date.now()}@example.com`;
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: uniqueEmail, password: 'pass123', firstName: 'A', lastName: 'B' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: uniqueEmail, password: 'pass456', firstName: 'C', lastName: 'D' })
        .expect(409);
    });

    it('returns 400 for invalid input', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'not-an-email', password: 'short' })
        .expect(400);
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('logs in valid user and returns tokens', async () => {
      const email = `login-test-${Date.now()}@example.com`;
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password: 'ValidPassword123!', firstName: 'Login', lastName: 'User' })
        .expect(201);

      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password: 'ValidPassword123!' })
        .expect(201);

      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.email).toBe(email);
    });

    it('returns 401 for wrong password', async () => {
      const email = `wrongpass-${Date.now()}@example.com`;
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password: 'CorrectPass123!', firstName: 'A', lastName: 'B' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password: 'WrongPassword!' })
        .expect(401);
    });

    it('returns 401 for unknown email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'anypassword' })
        .expect(401);
    });
  });

  describe('/api/auth/refresh (POST)', () => {
    it('returns new access token for valid refresh token', async () => {
      const email = `refresh-test-${Date.now()}@example.com`;
      const registerRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password: 'TestPass123!', firstName: 'Ref', lastName: 'User' })
        .expect(201);

      const { refreshToken } = registerRes.body;
      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
    });

    it('returns 401 for invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid.token.here' })
        .expect(401);
    });
  });

  describe('/api/auth/logout (POST)', () => {
    it('returns logout message', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .send({ refreshToken: 'any-token' })
        .expect(201);
    });
  });

  describe('authenticated request flow', () => {
    it('uses access token to access protected endpoints', async () => {
      const email = `protected-${Date.now()}@example.com`;
      const registerRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password: 'TestPass123!', firstName: 'Prot', lastName: 'User' })
        .expect(201);

      const { accessToken } = registerRes.body;

      const profileRes = await request(app.getHttpServer())
        .get('/api/profiles/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(profileRes.body).toHaveProperty('userId');
    });

    it('rejects unauthenticated requests to protected endpoints', async () => {
      await request(app.getHttpServer()).get('/api/profiles/me').expect(401);
    });

    it('rejects requests with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/profiles/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
