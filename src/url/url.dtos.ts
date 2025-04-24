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

export class URLResponseDTO {
  @ApiProperty({
    description: 'Unique identifier for the URL record',
    example: '5cc030ed-3bf0-491f-9c6b-7fd2deae5642',
  })
  id: string;

  @ApiProperty({
    description: 'Original (long) URL provided by the user',
    example: 'https://example.com/',
  })
  origin: string;

  @ApiProperty({
    description: 'Generated short code that maps to the original URL',
    example: 'uAvRkc',
  })
  shortCode: string;

  @ApiProperty({
    description: 'Full shortened URL accessible by users',
    example: 'http://host/uAvRkc',
  })
  shortUrl: string;

  @ApiProperty({
    description: 'Number of times the short URL was accessed',
    example: 0,
  })
  accessCount: number;

  @ApiProperty({
    description: 'Timestamp of when the short URL was created',
    example: '2025-04-23T19:43:08.817Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp of the last update to the short URL',
    example: '2025-04-23T19:43:08.817Z',
  })
  updatedAt: string;

  @ApiProperty({
    description:
      'Timestamp of soft deletion, if applicable. Null if not deleted.',
    example: null,
    nullable: true,
  })
  deletedAt: string | null;

  @ApiProperty({
    description: 'ID of the user who owns the short URL',
    example: 'b46e3ce8-be4b-4a20-a0e7-b58c567fc8f2',
  })
  userId: string;
}
