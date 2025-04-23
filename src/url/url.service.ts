import { Injectable } from '@nestjs/common';
import { ShortURLDTO } from './url.dtos';
import { ShortURLResponse } from './url.types';
import { nanoid } from 'nanoid';
import { URLRepository } from './url.repository';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

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
      userId: req.user?.userId,
    });

    return {
      shortUrl,
    };
  }

  async resolveRedirectByShortCode(where: Prisma.UrlWhereUniqueInput) {
    const url = await this.urlRepository.updateAccessCount(where);

    return { origin: url.origin };
  }

  findFromUser(where: Prisma.UrlWhereInput) {
    return this.urlRepository.findFromUser(where);
  }

  updateOrigin(where: Prisma.UrlWhereUniqueInput, origin: string) {
    return this.urlRepository.updateOrigin(where, origin);
  }

  softDelete(where: Prisma.UrlWhereUniqueInput) {
    return this.urlRepository.softDelete(where);
  }
}
