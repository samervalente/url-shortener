import { Module } from '@nestjs/common';
import { URLModule } from './url/url.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [URLModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
