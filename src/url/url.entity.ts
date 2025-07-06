import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class ShortUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  longUrl: string;

  @Column({ nullable: true })
  shortUrl: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  shortCode: string;

  @Column()
  userId: number;

  @Column({ default: 0 })
  visits: number;

  @ManyToOne(() => User, (user) => user.shortUrls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
