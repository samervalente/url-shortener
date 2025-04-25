import { Injectable } from '@nestjs/common';

import { UserPublic } from './types';
import { User, Prisma } from 'db/iam';
import { IamDbService } from '@shortener-ws/iam-db';

@Injectable()
export class UsersRepository {
  constructor(private prisma: IamDbService) {}

  create(data: Prisma.UserCreateInput): Promise<UserPublic> {
    return this.prisma.user.create({
      data,
      omit: {
        password: true,
      },
    });
  }

  findUserPublic(
    where: Prisma.UserWhereUniqueInput
  ): Promise<UserPublic | null> {
    return this.prisma.user.findUniqueOrThrow({
      where,
      omit: {
        id: true,
        password: true,
        role: true,
      },
    });
  }

  findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
    });
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserPublic> {
    return this.prisma.user.update({
      data: params.data,
      where: params.where,
      omit: {
        password: true,
      },
    });
  }

  softDelete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.update({
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
