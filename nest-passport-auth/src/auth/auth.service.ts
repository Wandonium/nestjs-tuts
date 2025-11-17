/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import type { Cache } from 'cache-manager';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = this.userService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserRefreshToken(refreshToken: string, userId: string) {
    try {
      console.log('userId: ', userId);
      const user = this.userService.findById(parseInt(userId));
      if (!user) throw new UnauthorizedException('User not found!');
      const userRefreshToken = await this.cacheManager.get(userId);
      if (!userRefreshToken)
        throw new UnauthorizedException('Refresh token not found!');
      const authenticated = await compare(
        refreshToken,
        userRefreshToken as string,
      );
      if (!authenticated)
        throw new UnauthorizedException('Refresh token not found!');
      return user;
    } catch (err) {
      console.error(
        '[auth.service.ts] - validateUserRefreshToken - error: ',
        err,
      );
      throw new UnauthorizedException('Refresh token not valid!');
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '15s',
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS')}ms`,
    });
    await this.cacheManager.set(user.userId, await hash(refresh_token, 10));
    console.log(
      'updated user: ',
      this.userService.updateUser({ ...user, refresh_token }),
    );
    return {
      access_token,
      refresh_token,
    };
  }

  async logout(user: any) {
    return await this.cacheManager.del(user.userId);
  }
}
