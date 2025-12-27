import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LoggingMiddleware } from '../middleware/global.middleware.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const ctx = context.switchToHttp()
    const req = ctx.getRequest<Request>() as any
    const res = ctx.getResponse<Response>() as any
    
    const {method, originalUrl} = req

    const reqId =  (req as any).reqId ?? ''

    const start = Date.now();
    return next.handle().pipe(
      finalize(() => {
        const ms = Date.now() - start;
        const status = res?.statusCode ?? 200;
        this.logger.log(
          `[OUT] ${method} ${originalUrl} -> ${status} in ${ms}ms${reqId ? ` | id=${reqId}` : ''}`,
        );
      }),
    );
  }
}