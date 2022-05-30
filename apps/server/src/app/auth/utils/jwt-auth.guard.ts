import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { BYPASS_AUTHORIZATION_TOKEN } from "./bypass-authorization";

export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler();
    if (
      this.reflector.get<boolean>(BYPASS_AUTHORIZATION_TOKEN, handler) === true
    ) {
      return true;
    }

    return super.canActivate(context);
  }
}
