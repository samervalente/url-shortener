import { Controller, Post, Body, Req, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { URLService } from './url.service';
import { ShortURLDTO } from './url.dtos';

@ApiTags('URL')
@Controller()
export class URLController {
  constructor(private readonly urlService: URLService) {}

  @Post('/short')
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiResponse({
    status: 201,
    description: 'The URL was successfully shortened.',
    schema: {
      example: {
        shortUrl: 'https://your-domain.com/a1b2c3',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid URL format.' })
  async shortURL(@Req() request: Request, @Body() shortURLDTO: ShortURLDTO) {
    return this.urlService.shortURL(request, shortURLDTO);
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
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const urlOrigin = await this.urlService.getURLOrigin({
      shortCode,
    });
    res.redirect(urlOrigin.origin);
  }
}
