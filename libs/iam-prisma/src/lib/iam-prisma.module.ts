import { Module } from '@nestjs/common';
import { IamPrismaService } from './iam-prisma.service';

@Module({
  providers: [IamPrismaService],
  exports: [IamPrismaService],
})
export class IamPrismaModule {}
