import { Injectable } from '@nestjs/common';
import { ShortURLDTO } from './url.dtos';
import { ShortURLRequestParams, ShortURLResponse } from './url.types';
import { nanoid } from 'nanoid';
import { URLRepository } from './url.repository';
import { Prisma } from 'db/shortener';

@Injectable()
export class URLService {
  private readonly SHORT_CODE_LENGTH = 6;

  constructor(private readonly urlRepository: URLRepository) {}

  async shortURL(
    shortURLDTO: ShortURLDTO,
    requestParams: ShortURLRequestParams
  ): Promise<ShortURLResponse> {
    const { protocol, host, user: requestUser } = requestParams;
    const shortCode = nanoid(this.SHORT_CODE_LENGTH);
    const shortUrl = `${protocol}://${host}/${shortCode}`;

    await this.urlRepository.create({
      origin: shortURLDTO.urlOrigin,
      shortCode,
      shortUrl,
      userId: requestUser?.userId,
    });

    return {
      shortUrl,
      ...(requestUser?.userId && { userId: requestUser.userId }),
    };
  }

  resolveRedirectByShortCode(where: Prisma.UrlWhereUniqueInput) {
    return this.urlRepository.updateAccessCount(where);
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

  async getRanking() {
    const ranking = await this.urlRepository.getRanking();

    return {
      data: ranking,
    };
  }
}
