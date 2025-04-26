import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDTO } from 'src/users/users.dto';

export class LoginCredentialsDTO {
  @ApiProperty({ name: 'password', description: 'Login password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ name: 'email', description: 'Login email' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SignUpDto extends CreateUserDTO {}
