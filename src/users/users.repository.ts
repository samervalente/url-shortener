import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/config/database/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UserPublic } from 'src/global/types';

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<UserPublic> {
    return this.prismaService.user.create({
      data,
      omit: {
        password: true,
      },
    });
  }

  findUserPublic(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserPublic | null> {
    return this.prismaService.user.findUnique({
      where,
      omit: {
        password: true,
      },
    });
  }

  findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUniqueOrThrow({
      where,
    });
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserPublic> {
    return this.prismaService.user.update({
      data: params.data,
      where: params.where,
      omit: {
        password: true,
      },
    });
  }

  softDelete(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.update({
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
