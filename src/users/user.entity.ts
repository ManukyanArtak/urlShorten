import { Exclude } from 'class-transformer';
import { ShortUrl } from '../url/url.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => ShortUrl, (shortUrl) => shortUrl.user)
  shortUrls: ShortUrl[];
}
