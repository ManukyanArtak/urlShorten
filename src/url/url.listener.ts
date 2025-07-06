import { Repository } from 'typeorm';
import { ShortUrl } from './url.entity';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UrlListener {
  constructor(
    @InjectRepository(ShortUrl)
    private shortUrlRepository: Repository<ShortUrl>,
  ) {}

  @OnEvent('shortUrl.visited')
  async handleShortUrlVisited(id: number) {
    try {
      await this.shortUrlRepository.increment({ id }, 'visits', 1);
    } catch (error) {
      console.error(`Failed to increment visits for ShortUrl ID: ${id}`, error);
    }
  }
}
