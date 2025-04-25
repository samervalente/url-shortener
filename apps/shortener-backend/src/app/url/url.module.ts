import { Module } from '@nestjs/common';
import { URLController } from './url.controller';
import { URLService } from './url.service';
import { URLRepository } from './url.repository';
import { ShortenerPrismaModule } from '@libs/shortener-prisma';
import { AuthModule } from '@libs/auth';

@Module({
  imports: [ShortenerPrismaModule, AuthModule],
  providers: [URLService, URLRepository],
  controllers: [URLController],
})
export class URLModule {}
