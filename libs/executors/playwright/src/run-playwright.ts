import { spawn } from "child_process";
import { platform } from "os";
import { relative } from "path";

export default function runPlaywright(
  path?: string
): Promise<{ success: boolean }> {
  // playwright
  const playwrightCmd: string =
    platform() === "win32" ? "playwright.cmd" : "playwright";
  const playwrightArgs: string[] = [
    "test",
    `--config=./apps/web-e2e/playwright.config.js`,
  ];

  if (path && path.trim() !== "") {
    // for windows systems we get something like this foo\\file.spec.ts which not works
    // together with playwright since he do not understand this one (even on windows)
    // and replace with foo/file.spec.ts
    playwrightArgs.push(
      relative(this.rootDir ?? ".", path).replace(/\\/g, "/")
    );
  }

  return new Promise((resolve, reject) => {
    const playwrightProcess = spawn(playwrightCmd, playwrightArgs, {
      stdio: "inherit",
    });
    playwrightProcess.on("exit", (code) => {
      code !== 0 ? reject({ success: false }) : resolve({ success: true });
    });
  });
}
