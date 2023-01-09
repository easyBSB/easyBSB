import { APIRequestContext, Page } from "@playwright/test";

export class SessionService {

  get sessionToken(): string | undefined {
    const storageDump = process.env['SESSION_STORAGE'];
    if (storageDump) {
      const storage = JSON.parse(storageDump) as Record<string, string>;
      return storage['Authorization'];
    }
    return void 0;
  }

  constructor(
    private readonly page: Page
  ) { }

  async login(
    username = "easybsb",
    password = "easybsb",
    cache = true
  ) {
    if (cache === false || !process.env["SESSION_STORAGE"]) {
      await this.page.goto("http://localhost:4200/login");

      const usernameControl = this.page.locator(
        '[data-e2e="authorization-login-username"] input[type="text"]'
      );
      const passwordControl = this.page.locator(
        '[data-e2e="authorization-login-password"] input[type="password"]'
      );
      await usernameControl.fill(username);
      await passwordControl.fill(password);

      await Promise.all([
        this.page.waitForResponse("http://localhost:4200/api/auth/login"),
        passwordControl.press("Enter"),
      ]);

      process.env["SESSION_STORAGE"] = await this.page.evaluate(() =>
        JSON.stringify(sessionStorage)
      );
      return;
    }

    await this.page.addInitScript((sessionStorageDump: string) => {
      const keyValue = Object.entries<string>(JSON.parse(sessionStorageDump));
      for (const [key, value] of keyValue) {
        window.sessionStorage.setItem(key, value);
      }
    }, process.env["SESSION_STORAGE"]);

    await this.page.goto("http://localhost:4200");
  }

  /** 
   * only returns the session token
   */
  loginSessionTokenOnly(
    request: APIRequestContext,
    username = "easybsb",
    password = "easybsb"
  ): Promise<string> {
    return request
      .post(`http://localhost:3333/api/auth/login`, {
        data: { username, password },
      })
      .then((response) => response.json())
      .then((data) => data.jwt);
  }
}