import { Module } from '@nestjs/common';
import { IamDbService } from './iam-db.service';

@Module({
  controllers: [],
  providers: [IamDbService],
  exports: [IamDbService],
})
export class IamDbModule {}
