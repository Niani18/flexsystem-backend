import { Logger, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

export class LoggingMiddleware implements NestMiddleware {
  
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {

    const { method, originalUrl } = req;
    const ip = (req.headers['x-forwarded-for'] as string) ?? req.ip ?? 'unknown';
    const ua = req.get('user-agent') || 'unknown';

    const reqId =
      (req.headers['x-request-id'] as string) ||
      (res.getHeader('x-request-id') as string) ||
      randomUUID();

    res.setHeader('x-request-id', reqId);
    (req as any).reqId = reqId;


    if (originalUrl === '/health') return next();

    this.logger.log(`[IN] ${method} ${originalUrl} | id=${reqId} | ip=${ip} | ua="${ua}"`);

    next();
  }
}