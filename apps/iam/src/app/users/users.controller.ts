import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';

import { RoleEnum } from 'db/iam';

import { UpdateUserDTO, UserPublicResponseDTO } from './users.dto';
import { UserPublic } from './types';
import { JWTAuthGuard } from '@libs/auth';
import { Public, Roles } from '@libs/shared';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get(':id/public')
  @ApiOperation({ summary: 'Get a public view of the user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: UserPublicResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  async findById(@Param('id') id: string): Promise<UserPublic | null> {
    return await this.usersService.findPublic({ id });
  }

  @UseGuards(JWTAuthGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
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
  update(@Param('id') id: string, @Body() updateData: UpdateUserDTO) {
    return this.usersService.update({ id }, updateData);
  }

  @UseGuards(JWTAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth('JWT')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
    type: UserPublicResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  delete(@Param('id') id: string) {
    return this.usersService.softDelete({ id });
  }
}
