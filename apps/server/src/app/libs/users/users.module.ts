import { RolesModule } from "@lib/roles";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./controllers/users.controller";
import { User } from "./entities/user";
import { UserService } from "./providers/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [TypeOrmModule, RolesModule, UserService],
})
export class UsersModule {}