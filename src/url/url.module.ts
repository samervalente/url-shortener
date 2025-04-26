import { Module } from '@nestjs/common';
import { URLController } from './url.controller';
import { URLService } from './url.service';
import { URLRepository } from './url.repository';
import { PrismaModule } from 'src/config/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [URLService, URLRepository],
  controllers: [URLController],
})
export class URLModule {}
