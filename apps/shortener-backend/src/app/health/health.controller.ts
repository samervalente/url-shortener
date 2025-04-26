import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
} from '@nestjs/terminus';
import { ShortenerPrismaService } from '@libs/shortener-prisma';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthCheck.name, { timestamp: true });

  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaService: ShortenerPrismaService
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    try {
      const result = await this.health.check([
        async () => {
          await this.prismaService.$queryRaw`SELECT 1`;
          return { database: { status: 'up' } };
        },
      ]);

      this.logger.log('Health check completed with success');
      return result;
    } catch (error: unknown) {
      this.logger.error('Failed on health check', (error as Error).stack);
      throw error;
    }
  }
}
