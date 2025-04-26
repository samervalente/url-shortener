import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ShortenerPrismaModule } from '@libs/shortener-prisma';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, HttpModule, ShortenerPrismaModule],
  controllers: [HealthController],
})
export class HealthModule {}
