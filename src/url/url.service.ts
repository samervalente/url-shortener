import { Injectable, NotFoundException } from '@nestjs/common';
import { ShortURLDTO } from './url.dtos';
import { ShortURLResponse } from './url.types';
import { nanoid } from 'nanoid';
import { URLRepository } from './url.repository';
import { Request } from 'express';
import { Prisma } from '@prisma/client';

@Injectable()
export class URLService {
  private readonly SHORT_CODE_LENGTH = 6;

  constructor(private readonly urlRepository: URLRepository) {}

  async shortURL(
    req: Request,
    shortURLDTO: ShortURLDTO,
  ): Promise<ShortURLResponse> {
    const shortCode = nanoid(this.SHORT_CODE_LENGTH);
    const shortUrl = `${req.protocol}://${req.get('Host')}/${shortCode}`;

    await this.urlRepository.create({
      origin: shortURLDTO.urlOrigin,
      shortCode,
      shortUrl,
    });

    return {
      shortUrl,
    };
  }

  async getURLOrigin(
    where: Prisma.UrlWhereUniqueInput,
  ): Promise<{ origin: string }> {
    const urlOrigin = await this.urlRepository.getURLOrigin(where);

    if (!urlOrigin) {
      throw new NotFoundException('Resource not found');
    }

    return urlOrigin;
  }
}
