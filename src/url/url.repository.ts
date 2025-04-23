import { Injectable } from '@nestjs/common';
import { Prisma, Url } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma.service';

@Injectable()
export class URLRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.UrlCreateInput) {
    return this.prisma.url.create({
      data,
    });
  }

  getLongURL(where: Prisma.UrlWhereUniqueInput): Promise<Url | null> {
    return this.prisma.url.findUnique({
      where,
    });
  }

  getURLOrigin(
    where: Prisma.UrlWhereUniqueInput,
  ): Promise<{ origin: string } | null> {
    return this.prisma.url.findUnique({
      where,
      select: {
        origin: true,
      },
    });
  }
}
