import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'securePassword123!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must contain at least 8 characters' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @ApiProperty({
    description: 'Name of the user (at least 2 characters)',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}

export class UserPublicResponseDTO {
  @ApiProperty({ description: 'User ID (UUID)' })
  id: string;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Date when the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the user was last updated' })
  updatedAt: Date;
}

export class UpdateUserDTO extends OmitType(CreateUserDTO, ['password']) {}
