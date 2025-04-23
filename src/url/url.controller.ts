import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ShortURLDTO } from './url.dtos';
import { URLService } from './url.service';
import { Request, Response } from 'express';
import { ApiParam } from '@nestjs/swagger';

@Controller()
export class URLController {
  constructor(private readonly urlService: URLService) {}
  @Post('/short')
  async shortURL(@Req() request: Request, @Body() shortURLDTO: ShortURLDTO) {
    return this.urlService.shortURL(request, shortURLDTO);
  }

  @Get(':shortCode')
  @ApiParam({ name: 'shortCode', type: String, description: 'URL Short code' })
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const urlOrigin = await this.urlService.getURLOrigin({
      shortCode,
    });
    res.redirect(urlOrigin.origin);
  }
}
