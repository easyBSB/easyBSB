import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles";
import { UsersController } from "./controllers/users.controller";
import { User } from "./entities/user";
import { UserService } from "./providers/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UsersModule {}
