import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from 'db/iam';

@Injectable()
export class IamDbService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
