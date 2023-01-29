import { InferSubjects, Ability } from "@casl/ability";
import { User } from "../../../users";
import { Actions } from "../constants";

export interface RoleRequirement {
  action: Actions;
  subject: Subjects;
}

export declare type Subjects = InferSubjects<typeof User> | "all";
export declare type AppAbility = Ability<[Actions, Subjects]>;
