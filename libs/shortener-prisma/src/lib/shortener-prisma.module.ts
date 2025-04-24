import { Module } from '@nestjs/common';

@Module({
  providers: [ShortenerPrismaModule],
  exports: [ShortenerPrismaModule],
})
export class ShortenerPrismaModule {}
