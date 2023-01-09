import { APIRequestContext, Page } from "@playwright/test";
import { resolveSessionToken, writeSessionToken } from "../utils/authorize";

export abstract class AbstractPageObject {

  private sessionToken?: string;

  constructor(
    protected readonly page: Page,
    protected readonly request: APIRequestContext
  ) {}

  async bootstrap(name = 'easybsb', password = 'easybsb') {
    await this.login(name, password);
    await this.initialize();
  }

  protected abstract initialize(): Promise<void>;

  async login(username = 'easybsb', password = 'easybsb') {
    const token = await resolveSessionToken(this.request, username, password);
    await writeSessionToken(this.page, token);
  }

  abstract reload(): Promise<void>;

  async execAsAdmin<T>(method: keyof T, ...arg: unknown[]): Promise<T | undefined>{
    if (!this.sessionToken) {
      throw new Error('no admin session available');
    }

    const currentSessionToken = await this.page.evaluate(() => window.sessionStorage.getItem(`Authorization`));
    let result: T | undefined = void 0;
    await this.setSessionToken(this.sessionToken);

    // check method exists
    try {
      // typings are not cool here
      // eslint-disable-next-line @typescript-eslint/ban-types
      result = await (this[method as keyof AbstractPageObject] as Function).call(this, ...arg)
    } catch (error) {
      console.error(error)
    }

    await this.setSessionToken(currentSessionToken ?? '');
    return result;
  }

  async setSessionToken(token: string): Promise<void> {
    return this.page.evaluate(
      (token: string) => window.sessionStorage.setItem('Authorization', token),
      token
    );
  }
}
