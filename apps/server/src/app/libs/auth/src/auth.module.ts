import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

// app modules

import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./providers/auth.service";
import { LocalStrategy } from "./utils/local.strategy";
import { JwtStrategy } from "./utils/jwt-auth.strategy";
import { RolesModule } from "../../roles/src/roles.module";
import { UsersModule } from "../../users";

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    RolesModule,
    ConfigModule,
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: process.env.EASYBSB_JWT_SECRET || configService.get("jwt.secret"),
          signOptions: {
            expiresIn: "60d",
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
