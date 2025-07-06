import { Repository } from 'typeorm';
import { ShortUrl } from './url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(ShortUrl)
    private shortUrlRepository: Repository<ShortUrl>,
    private configService: ConfigService,
  ) {}

  private generateRandomCode(length = 10): string {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }

  async createShortUrl(longUrl: string, userId: number): Promise<ShortUrl> {
    try {
      const entry = this.shortUrlRepository.create({ longUrl, userId });
      const saved = await this.shortUrlRepository.save(entry);

      let shortCode = this.generateRandomCode();
      let retryCount = 0;
      const maxRetries = 5;

      while (await this.shortUrlRepository.findOne({ where: { shortCode } })) {
        retryCount++;
        if (retryCount > maxRetries) {
          throw new BadRequestException('Failed to generate unique short code');
        }

        shortCode = this.generateRandomCode();
      }

      saved.shortCode = shortCode;
      saved.shortUrl = `${this.configService.get('APP_URL')}/${shortCode}`;

      return await this.shortUrlRepository.save(saved);
    } catch (error) {
      console.error('Create short URL error:', error);
      throw new BadRequestException('Failed to create short URL');
    }
  }

  async findByShortCode(shortCode: string): Promise<ShortUrl | null> {
    const shortUrl = await this.shortUrlRepository.findOne({
      where: { shortCode },
    });
    return shortUrl || null;
  }

  async getUserUrls(userId: number): Promise<ShortUrl[]> {
    return await this.shortUrlRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async incrementVisits(id: number): Promise<void> {
    await this.shortUrlRepository.increment({ id }, 'visits', 1);
  }
}
