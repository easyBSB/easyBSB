import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PATH_METADATA } from "@nestjs/common/constants";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User } from "@app/users/entities/user";
import { ForbiddenError } from "@casl/ability";

import { AbilityFactory } from "../providers/ability.factory";
import { EASYBSB_ROLE_CHECK, RoleRequirement } from "./check-ability.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly abilityFactory: AbilityFactory,
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user: User = context.switchToHttp().getRequest().user;
    const path = this.reflector.get(PATH_METADATA, context.getHandler());

    if (!user && path === "login") {
      return true;
    }

    if (!user) {
      throw new UnauthorizedException("login first");
    }

    const roleRequirements: RoleRequirement[] = this.reflector.get(
      EASYBSB_ROLE_CHECK,
      context.getHandler()
    );
    if (roleRequirements) {
      const ability = this.abilityFactory.defineAbility(user);
      try {
        for (const requirement of roleRequirements) {
          const { action, subject } = requirement;
          ForbiddenError.from(ability).throwUnlessCan(action, subject);
        }
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new ForbiddenException(error.message);
        }
        throw error;
      }
    }
    return true;
  }
}
