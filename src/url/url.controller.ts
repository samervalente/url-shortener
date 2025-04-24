import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Res,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { URLService } from './url.service';
import { ShortURLDTO, URLResponseDTO } from './url.dtos';
import { JwtOptionalAuthGuard } from 'src/auth/guards/jwt-optional-auth.guard';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from '@prisma/client';
import { ExpressRequest } from 'src/global/types';

@ApiTags('URL')
@Controller()
export class URLController {
  constructor(private readonly urlService: URLService) {}
  @UseGuards(JwtOptionalAuthGuard)
  @Post('/short')
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiResponse({
    status: 201,
    description: 'The URL was successfully shortened.',
    schema: {
      example: {
        shortUrl: 'https://domain/a1b2c3',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid URL format.' })
  @ApiBearerAuth('JWT')
  async shortURL(@Req() request: Request, @Body() shortURLDTO: ShortURLDTO) {
    return this.urlService.shortURL(shortURLDTO, {
      host: request.host,
      protocol: request.protocol,
      user: request.user,
    });
  }

  @UseGuards(JWTAuthGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @ApiBearerAuth('JWT')
  @Get('/user')
  @ApiOperation({ summary: "Get user's URLs" })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of URLs belonging to the authenticated user.',
    type: [URLResponseDTO],
  })
  findFromUser(@Req() req: ExpressRequest.ReqType) {
    return this.urlService.findFromUser({ userId: req.user.userId });
  }

  @UseGuards(JWTAuthGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @ApiBearerAuth('JWT')
  @Patch(':id/origin')
  @ApiOperation({ summary: 'Update the original URL' })
  @ApiParam({ name: 'id', type: String, description: 'URL identifier' })
  @ApiResponse({
    status: 200,
    description: 'URL successfully updated.',
    type: URLResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  updateOrigin(@Param('id') urlId: string, @Body() shortUrlDTO: ShortURLDTO) {
    return this.urlService.updateOrigin({ id: urlId }, shortUrlDTO.urlOrigin);
  }

  @UseGuards(JWTAuthGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @ApiBearerAuth('JWT')
  @Delete('/:id')
  @ApiOperation({ summary: 'Soft delete a shortened URL' })
  @ApiParam({ name: 'id', type: String, description: 'URL identifier' })
  @ApiResponse({ status: 200, description: 'URL successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  softDelete(@Param('id') urlId: string) {
    return this.urlService.softDelete({ id: urlId });
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiParam({
    name: 'shortCode',
    type: String,
    description: 'The short code representing the original URL',
    example: 'a1b2c3',
  })
  @ApiResponse({ status: 302, description: 'Redirects to the original URL.' })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  async resolveRedirectByShortCode(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const urlOrigin = await this.urlService.resolveRedirectByShortCode({
      shortCode,
    });
    res.redirect(urlOrigin.origin);
  }
}
