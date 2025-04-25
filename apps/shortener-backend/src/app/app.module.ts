import { Module } from '@nestjs/common';
import { URLModule } from './url/url.module';

@Module({
  imports: [URLModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
