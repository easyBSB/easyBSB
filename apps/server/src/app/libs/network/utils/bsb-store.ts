import { Injectable } from "@nestjs/common";
import { Bus } from '../model/bus.entity';
import { BSB, Category, Command, KeyItem, LanguageKeys, TranslateItem, Type } from '@eaysbsb/parser';

interface EasybsbCommandType extends Omit<Type, 'unit'> {
  unit: string
}

interface EasybsbCommandEnum {
  [key: string]: string;
}

interface EasybsbCommand extends Omit<Command, 'description' | 'type' | 'enum'> {
  description: string;
  type: EasybsbCommandType
  enum: EasybsbCommandEnum
}

export interface EasybsbCategory extends Omit<Category, 'name' | 'commands'> {
  name: string;
  commands: EasybsbCommand[];
}

@Injectable()
export class BsbStorage {

  private store: Map<Bus['id'], BSB> = new Map();

  public register(id: Bus['id'], bsb: BSB) {
    if (!this.store.has(id)) {
      this.store.set(id, bsb);
    }
  }

  public getById(id: Bus['id']): BSB | undefined {
    if (this.store.has(id)) {
      return this.store.get(id);
    }
  }

  /**
   * @description resolve and transform configuration from a bus, all translations will made directly
   * so we ensure to save 70% to response size.
   */
  public getConfiguration(id: Bus['id'], lang: LanguageKeys = 'KEY'): KeyItem<EasybsbCategory> | undefined {
    const bsb = this.getById(id);
    const i18nKey = lang.toUpperCase() as LanguageKeys;

    if (!bsb) {
      return;
    }

    const categories = bsb.definition.config.categories;
    const result: Record<string, EasybsbCategory> = {};

    for (const [key, category] of Object.entries(categories)) {
      const commands: EasybsbCommand[] = [];
      const name = this.translateItem(category.name, i18nKey);

      for (const command of category.commands) {
        const commandType: EasybsbCommandType = { ...command.type, unit: this.translateItem(command.type.unit, i18nKey)};
        const commandEnum: EasybsbCommandEnum = this.translateCommandEnum(command, i18nKey);
        const commandDescription = this.translateItem(command.description, i18nKey);

        commands.push({ 
          ...command,
          description: commandDescription,
          enum: commandEnum,
          type: commandType
        });
      }
      result[key] = { ...category, name, commands };
    }

    return result;
  }

  /**
   * @description translate command enum values
   */
  private translateCommandEnum(command: Command, i18nKey: LanguageKeys): EasybsbCommandEnum | undefined {
    if (!command.enum) {
      return;
    }

    const result: EasybsbCommandEnum = {};
    for (const [key, value] of Object.entries(command.enum)) {
      result[key] = this.translateItem(value, i18nKey);
    }
    return result;
  }

  /**
   * @description translate item by given language key otherwise return TEXT_KEY
   */
  private translateItem(data: TranslateItem, lang: LanguageKeys): string | undefined {
    if (!data) {
      return;
    }

    if (data[lang] && data[lang].trim() !== '') {
      return data[lang];
    }
    return data['KEY'];
  }
}
