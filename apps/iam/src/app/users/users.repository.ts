import { Injectable } from '@nestjs/common';

import { UserPublic } from './types';
import { User, Prisma } from 'db/iam';
import { IamDbService } from '@libs/iam-db';

@Injectable()
export class UsersRepository {
  constructor(private prisma: IamDbService) {}

  async create(data: Prisma.UserCreateInput): Promise<UserPublic> {
    const existingDeletedUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
        deletedAt: { not: null },
      },
    });

    if (existingDeletedUser) {
      return this.prisma.user.update({
        where: { id: existingDeletedUser.id },
        data: {
          ...data,
          deletedAt: null,
        },
      });
    }

    return this.prisma.user.create({
      data,
    });
  }

  findUserPublic(
    where: Prisma.UserWhereUniqueInput
  ): Promise<UserPublic | null> {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        ...where,
        deletedAt: null,
      },
      omit: {
        id: true,
        password: true,
        role: true,
      },
    });
  }

  findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserPublic> {
    return this.prisma.user.update({
      data: params.data,
      where: {
        ...params.where,
        deletedAt: null,
      },
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
