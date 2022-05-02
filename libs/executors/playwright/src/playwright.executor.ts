import { ExecutorContext } from '@nrwl/devkit'
import runPlaywright from "./run-playwright";
import runDevServer from "./run-dev-server";
import runApiServer from './run-api-server';
import { EOL } from 'os';

interface ExecutorResult {
  success: boolean;
}

interface PlaywrightExecutorOptions {}

export default async function playwrightExecutor(
  options: [PlaywrightExecutorOptions],
  context: ExecutorContext,
): Promise<ExecutorResult> {
  /*
  const devServer$ = from(runDevServer(context))

  if (watch) {
    const watcher = new FileWatcherService(["apps/web-e2e/src"]);
    merge(devServer$, watcher.change())
  } else {
    of(devServer$);
  }
  */

  // @todo make it configurable, currently disabled for ci pipeline
  // const watch = false;
  let success = true

  // run all servers
  await runApiServer(context).next()

  process.stdout.write('\x1b[32m***** Web starting ******\x1b[0m' + EOL)
  await runDevServer(context).next()

  try {
    success = await (await runPlaywright()).success
  } catch (error) {
    success = false
  }

  return { success };
}
