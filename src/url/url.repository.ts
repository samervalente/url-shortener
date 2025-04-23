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

  updateAccessCount(where: Prisma.UrlWhereUniqueInput) {
    return this.prisma.url.update({
      where: {
        ...where,
        deletedAt: null,
      },
      data: {
        accessCount: {
          increment: 1,
        },
      },
    });
  }

  findFromUser(where: Prisma.UrlWhereInput) {
    return this.prisma.url.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  updateOrigin(where: Prisma.UrlWhereUniqueInput, origin: string) {
    return this.prisma.url.update({
      where: {
        ...where,
        deletedAt: null,
      },
      data: {
        origin,
      },
    });
  }

  softDelete(where: Prisma.UrlWhereUniqueInput) {
    return this.prisma.url.update({
      where: {
        ...where,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
