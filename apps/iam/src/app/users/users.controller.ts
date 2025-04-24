import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';

import { Prisma, RoleEnum } from 'db/iam';

import { UpdateUserDTO, UserPublicResponseDTO } from './users.dto';
import { UserPublic } from './types';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '@libs/shared';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
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
    @Param('id') id: Prisma.UserWhereUniqueInput
  ): Promise<UserPublic | null> {
    return this.usersService.findPublic(id);
  }

  @UseGuards(JWTAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth('JWT')
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
    @Body() updateData: UpdateUserDTO
  ) {
    return this.usersService.update(id, updateData);
  }
}
