import {
  Controller,
  Post,
  Body,
  Req,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { UrlService } from './url.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from '../common/decorators/public.decorator';
import { CreateShortUrlDto } from './dtos/create-short-url.dto';
import { RequestWithAuthPayloadI } from '../auth/interfaces/auth.interface';

@Controller('')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly eventEmitter: EventEmitter2,
    private configService: ConfigService,
  ) {}

  @Post('url')
  async create(
    @Body() dto: CreateShortUrlDto,
    @Req() req: RequestWithAuthPayloadI,
  ) {
    try {
      const userId = req.user.id;

      const result = await this.urlService.createShortUrl(dto.longUrl, userId);

      return {
        message: 'Short URL created successfully',
        ...result,
      };
    } catch (error) {
      console.error('Short URL creation error:', error);
      throw new BadRequestException('Could not create short URL');
    }
  }


  @Get('/url')
  async getUrls(@Req() req: RequestWithAuthPayloadI) {
    try {
      const userId = req.user.id;
      const urls = await this.urlService.getUserUrls(userId);
      return {
        message: 'User URLs retrieved successfully',
        urls,
      };
    } catch (error) {
      console.error('Error fetching user URLs:', error);
      throw new BadRequestException('Could not fetch URLs');
    }
  }

  @Public()
  @Get(':shortCode')
  async redirectToOriginal(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const url = await this.urlService.findByShortCode(shortCode);

    if (!url) {
      return res.redirect(`${this.configService.get('WEBSITE_URL')}/404`);
    }

    this.eventEmitter.emit('shortUrl.visited', url.id);

    return res.redirect(url.longUrl);
  }
}
