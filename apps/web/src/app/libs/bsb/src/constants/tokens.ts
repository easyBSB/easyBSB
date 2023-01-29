import { InjectionToken } from "@angular/core";
import { Queue } from "@easy-bsb/queue";
import { FetchParamTask } from "../utils/fetch-param.task";

export const PARAMETER_QUEUE = new InjectionToken<Queue<FetchParamTask>>('Parameter Queue');