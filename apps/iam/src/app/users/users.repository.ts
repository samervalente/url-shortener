import { Injectable } from '@nestjs/common';

import { UserPublic } from './types';
import { User, Prisma } from 'db/iam';
import { IamPrismaService } from '@libs/iam-prisma';

@Injectable()
export class UsersRepository {
  constructor(private prismaService: IamPrismaService) {}

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
