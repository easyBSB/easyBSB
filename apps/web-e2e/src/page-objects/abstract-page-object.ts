import { APIRequestContext, Page } from "@playwright/test";
import { resolveSessionToken, writeSessionToken } from "../support/authorize";

export abstract class AbstractPageObject {

  constructor(
    protected readonly page: Page,
    protected readonly request: APIRequestContext
  ) {}

  async bootstrap() {
    await this.login();
    await this.initialize();
  }

  protected abstract initialize(): Promise<void>;

  private async login() {
    const token = await resolveSessionToken(this.request);
    console.log(token);
    await writeSessionToken(this.page, token);
  }
}
