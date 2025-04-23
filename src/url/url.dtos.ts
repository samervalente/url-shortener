import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class ShortURLDTO {
  @ApiProperty({
    description: 'The original URL to be shortened.',
    type: String,
    example: 'https://example.com',
  })
  @IsUrl()
  @IsNotEmpty()
  urlOrigin: string;
}
