import { Module } from '@nestjs/common';
import { ShortenerPrismaService } from './shortener-prisma.service';

@Module({
  providers: [ShortenerPrismaService],
  exports: [ShortenerPrismaService],
})
export class ShortenerPrismaModule {}
