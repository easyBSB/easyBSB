import { User } from "@app/users";
import { InferSubjects, Ability } from "@casl/ability";
import { Actions } from "../constants/actions";

export declare type Subjects = InferSubjects<typeof User> | 'all'
export declare type AppAbility = Ability<[Actions, Subjects]>