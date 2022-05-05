import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from '@nestjs/config'

// app modules
import { UsersModule } from "@users/users.module"

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";

@Module({
  providers: [
    AuthService,
    LocalStrategy
  ],
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: '60s'
          }
        }
      },
      inject: [ ConfigService ]
    })
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule {}