import { HttpContextToken } from "@angular/common/http";
import { RequestContext } from "../core/error-handler/error.interceptor";

export const RequestContextToken = new HttpContextToken<RequestContext>(() => new RequestContext(null));