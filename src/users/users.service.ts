import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';

import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { Prisma, User } from '@prisma/client';
import { UserPublic } from 'src/global/types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(data: CreateUserDTO): Promise<UserPublic> {
    return await this.usersRepository.create(data);
  }

  async findPublic(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserPublic | null> {
    return this.usersRepository.findUserPublic(where);
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.usersRepository.findOne(where);
  }
  async update(
    where: Prisma.UserWhereUniqueInput,
    updateData: UpdateUserDTO,
  ): Promise<UserPublic | null> {
    const updatedUser = await this.usersRepository.update({
      data: updateData,
      where,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const deletedUser = await this.usersRepository.delete(where);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
}
