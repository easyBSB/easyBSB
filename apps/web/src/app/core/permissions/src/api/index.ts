import { PureAbility, AbilityClass } from "@casl/ability";

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export enum Subjects {
  All = 'all',
  User = 'user',
  Devices = 'devices'
}

export type AppAbility = PureAbility<[Actions, Subjects]>;
export const AppAbility: AbilityClass<AppAbility> = PureAbility;
