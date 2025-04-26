import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuditMiddleware.name, {
    timestamp: true,
  });

  use(req: Request, _: Response, next: () => void) {
    const logIdentifier = randomUUID();
    const { method, originalUrl } = req;
    const user = req.user;
    const userId = user ? user.userId : 'anonymous';

    this.logger.log(
      `[Audit Log - ${logIdentifier}] User ${userId} made a ${method} request to ${originalUrl} `
    );

    next();
  }
}
