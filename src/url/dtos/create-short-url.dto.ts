import { IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl()
  longUrl: string;
}
