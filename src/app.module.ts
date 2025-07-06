import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { UrlModule } from './url/url.module';
import { ShortUrl } from './url/url.entity';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IsUnique } from './common/validation/is-unique.constraint';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('POSTGRES_PASSWORD'), // or DB_PASSWORD if you define that
          database: configService.get<string>('DB_DATABASE'),
          entities: [User, ShortUrl],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUnique],
})
export class AppModule {}
