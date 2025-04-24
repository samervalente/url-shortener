import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from 'db/iam';

@Injectable()
export class IamPrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
