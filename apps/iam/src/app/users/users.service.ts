import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

import { CreateUserDTO, UpdateUserDTO } from './users.dto';
import { Prisma } from 'db/iam';
import { UserPublic } from './types';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(data: CreateUserDTO): Promise<UserPublic> {
    return await this.usersRepository.create(data);
  }

  async findPublic(where: Prisma.UserWhereUniqueInput) {
    return this.usersRepository.findUserPublic(where);
  }

  findOne(where: Prisma.UserWhereUniqueInput) {
    return this.usersRepository.findOne(where);
  }
  update(where: Prisma.UserWhereUniqueInput, updateData: UpdateUserDTO) {
    return this.usersRepository.update({
      data: updateData,
      where,
    });
  }

  softDelete(where: Prisma.UserWhereUniqueInput) {
    return this.usersRepository.softDelete(where);
  }
}
