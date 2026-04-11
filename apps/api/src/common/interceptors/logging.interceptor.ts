import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

const SENSITIVE_FIELDS = ['password', 'currentPassword', 'newPassword', 'confirmPassword', 'refreshToken', 'accessToken', 'token', 'secret', 'authorization', 'apiKey', 'api_key'];

function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') return body;
  const sanitized: any = {};
  for (const key of Object.keys(body)) {
    if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof body[key] === 'object' && body[key] !== null) {
      sanitized[key] = sanitizeBody(body[key]);
    } else {
      sanitized[key] = body[key];
    }
  }
  return sanitized;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;
        this.logger.log(`${method} ${url} ${statusCode} - ${duration}ms`);
        if (request.body && Object.keys(request.body).length > 0) {
          const sanitizedBody = sanitizeBody(request.body);
          this.logger.debug(`Body: ${JSON.stringify(sanitizedBody)}`);
        }
      }),
    );
  }
}
