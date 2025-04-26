import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IamDbModule } from '@libs/iam-db';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, HttpModule, IamDbModule],
  controllers: [HealthController],
})
export class HealthModule {}
