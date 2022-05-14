import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user";
import { UserService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService],
  exports: [TypeOrmModule, UserService]
})
export class UsersModule {}