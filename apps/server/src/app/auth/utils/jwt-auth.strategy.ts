import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@app/users/entities/user";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwt.secret"),
    });
  }

  async validate(payload: User & { exp: number; iat: number }): Promise<User> {
    // this validates the user by default should we call the auth service to do that ?
    const { exp, iat, ...user } = payload;
    if (iat < exp) {
      return user;
    }

    throw new UnauthorizedException();
  }
}
