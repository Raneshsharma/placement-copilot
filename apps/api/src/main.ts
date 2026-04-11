import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

function getAllowedOrigins(): string[] {
  const origins = process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173';
  // Validate each origin is a proper URL to prevent injection via CORS_ORIGINS env var
  return origins.split(',').map(o => o.trim()).filter(o => {
    try {
      const url = new URL(o);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  app.getHttpAdapter().get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const allowedOrigins = getAllowedOrigins();
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86400,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());


  const config = new DocumentBuilder()
    .setTitle('Placement Copilot API')
    .setDescription('AI-powered career execution platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT || 3001);
  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
