import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';

import { User, Prisma } from '@prisma/client';

import {
  CreateUserDTO,
  UpdateUserDTO,
  UserPublicResponseDTO,
} from './users.dto';
import { UserPublic } from 'src/global/types';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
  })
  @ApiBody({ type: CreateUserDTO })
  create(@Body() data: CreateUserDTO): Promise<User> {
    return this.usersService.create(data);
  }

  @Get(':id/public')
  @ApiOperation({ summary: 'Get a public view of the user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: UserPublicResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  findById(
    @Param('id') id: Prisma.UserWhereUniqueInput,
  ): Promise<UserPublic | null> {
    return this.usersService.findPublic(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user data by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: UserPublicResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDTO })
  update(
    @Param('id') id: Prisma.UserWhereUniqueInput,
    @Body() updateData: UpdateUserDTO,
  ): Promise<UserPublic | null> {
    return this.usersService.update(id, updateData);
  }
}
