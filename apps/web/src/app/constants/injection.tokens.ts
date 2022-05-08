import { InjectionToken } from "@angular/core"
import { environment } from "../../environments/environment"

export type APP_ENVIRONMENT = typeof environment;

export const APP_ENVIRONMENT = new InjectionToken('App Environment Variables', {
  providedIn: 'root',
  factory: () => environment
})
