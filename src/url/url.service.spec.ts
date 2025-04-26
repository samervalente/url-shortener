import { Test, TestingModule } from '@nestjs/testing';
import { URLService } from './url.service';
import { URLRepository } from './url.repository';

import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { RoleEnum } from '@prisma/client';

jest.mock('nanoid', () => ({
  nanoid: jest.fn().mockReturnValue('abc123'),
}));

const mockRequest = {
  protocol: 'http',
  host: 'localhost:3000',
  user: undefined,
};

const mockAuthenticatedRequest = {
  ...mockRequest,
  user: {
    name: 'John Doe',
    userId: 'b46e3ce8-be4b-4a20-a0e7-b58c567fc8f2',
    email: 'email@example.com',
    accessToken: 'jwt_access_token',
    role: RoleEnum.USER,
  },
};

const mockShortUrl = {
  id: 'uuid',
  shortCode: 'abc123',
  originalUrl: 'https://example.com',
  userId: 'user-id',
  clickCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockUrlRepository = {
  create: jest.fn(),
  updateAccessCount: jest.fn(),
  findFromUser: jest.fn(),
  updateOrigin: jest.fn(),
  softDelete: jest.fn(),
};

const baseUrl = `${mockRequest.protocol}://${mockRequest.host}`;
const shortURLDTO = { urlOrigin: 'https://teddy360.com.br' };

describe('URLService', () => {
  let urlService: URLService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        URLService,
        {
          provide: URLRepository,
          useValue: mockUrlRepository,
        },
      ],
    }).compile();

    urlService = module.get<URLService>(URLService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortURL', () => {
    it('should create a shortened URL with an authenticated user', async () => {
      mockUrlRepository.create.mockResolvedValue({
        ...mockShortUrl,
        userId: mockAuthenticatedRequest.user.userId,
      });

      const result = await urlService.shortURL(
        shortURLDTO,
        mockAuthenticatedRequest
      );

      expect(result.shortUrl).toBe(`${baseUrl}/${mockShortUrl.shortCode}`);
      expect(mockUrlRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: shortURLDTO.urlOrigin,
          userId: mockAuthenticatedRequest.user.userId,
        })
      );
    });

    it('should create a shortened URL without an authenticated user', async () => {
      mockUrlRepository.create.mockResolvedValue({
        ...mockShortUrl,
      });

      const result = await urlService.shortURL(shortURLDTO, mockRequest);

      expect(result.shortUrl).toBe(`${baseUrl}/${mockShortUrl.shortCode}`);
      expect(mockUrlRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: shortURLDTO.urlOrigin,
          shortCode: mockShortUrl.shortCode,
          shortUrl: `${baseUrl}/${mockShortUrl.shortCode}`,
          userId: undefined,
        })
      );
    });

    it('should throw error if URL is invalid', async () => {
      const shortURLDTO = { urlOrigin: 'invalid-url' };

      try {
        await urlService.shortURL(shortURLDTO, mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('resolveRedirectByShortCode', () => {
    it('should resolve and increment access count on valid shortCode', async () => {
      const mockUrl = {
        origin: shortURLDTO.urlOrigin,
        accessCount: 1,
      };
      const where = { shortCode: 'abc123' };

      mockUrlRepository.updateAccessCount.mockResolvedValue(mockUrl);

      const result = await urlService.resolveRedirectByShortCode(where);

      expect(result.origin).toBe(shortURLDTO.urlOrigin);
      expect(mockUrlRepository.updateAccessCount).toHaveBeenCalledWith(where);
    });

    it('should throw NotFoundException for invalid shortCode', async () => {
      const where = { shortCode: 'invalid' };

      mockUrlRepository.updateAccessCount.mockResolvedValue(null);

      try {
        await urlService.resolveRedirectByShortCode(where);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findFromUser', () => {
    it('should find URLs from user', async () => {
      const userId = 'b46e3ce8-be4b-4a20-a0e7-b58c567fc8f2';
      const mockUrls = [
        { origin: 'https://teddy360.com.br', shortCode: 'abc123' },
        { origin: 'https://google.com', shortCode: 'xyz789' },
      ];

      mockUrlRepository.findFromUser.mockResolvedValue(mockUrls);

      const result = await urlService.findFromUser({ userId });

      expect(result).toEqual(mockUrls);
      expect(mockUrlRepository.findFromUser).toHaveBeenCalledWith({ userId });
    });
  });

  describe('updateOrigin', () => {
    it('should update the origin URL', async () => {
      const where = { shortCode: 'abc123' };
      const origin = 'https://new-url.com';

      mockUrlRepository.updateOrigin.mockResolvedValue({ origin });

      const result = await urlService.updateOrigin(where, origin);

      expect(result.origin).toBe(origin);
      expect(mockUrlRepository.updateOrigin).toHaveBeenCalledWith(
        where,
        origin
      );
    });

    it('should throw NotFoundException if URL not found', async () => {
      const where = { shortCode: 'invalid' };
      const origin = 'https://new-url.com';

      mockUrlRepository.updateOrigin.mockResolvedValue(null);

      try {
        await urlService.updateOrigin(where, origin);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('softDelete', () => {
    it('should soft delete a URL', async () => {
      const where = { shortCode: 'abc123' };

      mockUrlRepository.softDelete.mockResolvedValue({
        ...where,
        deletedAt: new Date(),
      });

      const result = await urlService.softDelete(where);

      expect(result.deletedAt).toBeDefined();
      expect(mockUrlRepository.softDelete).toHaveBeenCalledWith(where);
    });

    it('should throw NotFoundException if URL not found', async () => {
      const where = { shortCode: 'invalid' };

      mockUrlRepository.softDelete.mockResolvedValue(null);

      try {
        await urlService.softDelete(where);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
