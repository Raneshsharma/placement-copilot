import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[\s\-]+/g, '_')
    .replace(/^_/, '')
    .toUpperCase();
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Always log the full error server-side with request context
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Unhandled ${status} error on ${request?.method} ${request?.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `HTTP ${status} on ${request?.method} ${request?.url}: ${exception?.message}`,
      );
    }

    // Never expose internal error details to the client in production-like environments
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again later.',
        },
      });
      return;
    }

    // For client errors, extract safe message only
    let errorMessage = 'An error occurred';
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        errorMessage = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, any>;
        errorMessage = Array.isArray(obj.message) ? obj.message[0] : (obj.message || exception.message || errorMessage);
      }
    } else {
      errorMessage = 'An error occurred';
    }

    response.status(status).json({
      success: false,
      error: {
        code: exception.name || 'HTTP_ERROR',
        message: errorMessage,
        statusCode: status,
      },
    });
  }
}
