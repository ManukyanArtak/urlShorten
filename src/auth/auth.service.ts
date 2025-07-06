import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AuthPayloadI } from './interfaces/auth.interface';
import { CreateUserInput } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  signIn = async (email: string, password: string) => {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new ForbiddenException();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(isMatch, user.password, password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_KEY'),
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_KEY'),
      expiresIn: '365d',
    });

    return {
      refreshToken,
      accessToken,
    };
  };

  register = async (userData: CreateUserInput) => {
    return await this.usersService.createUser(userData);
  };

  async verifyToken(request: Request): Promise<AuthPayloadI> {
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('ACCESS_TOKEN_KEY'),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
