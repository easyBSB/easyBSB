import { SetMetadata } from "@nestjs/common";

export const BYPASS_AUTHORIZATION_TOKEN = "bypassAuthorization";

export function BypassAuthorization() {
  return SetMetadata(BYPASS_AUTHORIZATION_TOKEN, true);
}
