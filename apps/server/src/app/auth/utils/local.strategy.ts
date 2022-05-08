import { Strategy } from 'passport-local';
import { PassportStrategy, AbstractStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) implements AbstractStrategy {

  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<string> {
    const user = await this.authService.login(username, password)
    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}