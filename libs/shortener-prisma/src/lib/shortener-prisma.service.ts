import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from 'db/shortener';

@Injectable()
export class ShortenerPrismaService
  extends PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }
}
