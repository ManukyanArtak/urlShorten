import { Module } from '@nestjs/common';
import { ShortUrl } from './url.entity';
import { UrlService } from './url.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlListener } from './url.listener';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ShortUrl])],
  providers: [UrlService, UrlListener],
  controllers: [UrlController],
})
export class UrlModule {}
