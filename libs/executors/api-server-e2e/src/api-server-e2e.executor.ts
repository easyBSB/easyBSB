import { ExecutorContext, logger, runExecutor } from "@nrwl/devkit";
import { ChildProcess, fork } from "child_process";
import { EOL } from "os";

export interface ExecutorEvent {
  outfile: string;
  success: boolean;
}

interface ApiServerExecutorOptions {}
let serverProcess: ChildProcess = null;

/**
 * inside of mac it seems the server process is not killed
 * if the e2e test stops which leads to the problem we have
 * to kill the process with pkill pid inside termial
 */
export default async function* apiServerE2Executor(
  options: [ApiServerExecutorOptions],
  context: ExecutorContext
): AsyncGenerator<ExecutorEvent> {
  // const watch = false;
  let success = true;

  // kills the node process
  process.on("exit", () => killServerProcess());

  // run api server
  process.stdout.write("\x1b[32m***** Api starting *****\x1b[0m" + EOL);

  for await (const event of startBuild(options, context)) {
    if (!event.success) {
      logger.error("There was an error with the build. See above.");
      logger.info(`${event.outfile} was not restarted.`);
    }

    if (serverProcess) {
      await killServerProcess();
    }

    // seems even nx does not suport hot reload
    try {
      await runServer(event);
    } catch (error) {
      logger.error("could not start dev server target");
      throw error;
    }

    yield event;
  }

  return { success };
}

async function* startBuild(options: unknown, context: ExecutorContext) {
  const executorOptions = {
    project: "server",
    target: "build",
    configuration: "e2e",
  };
  yield* await runExecutor<ExecutorEvent>(
    executorOptions,
    { watch: false },
    context
  );
}

async function runServer(event: ExecutorEvent): Promise<void> {
  serverProcess = fork(event.outfile, {
    env: { ...process.env },
    stdio: "inherit",
  });

  return new Promise((resolve, reject) => {
    serverProcess.on("spawn", () => {
      serverProcess.pid ? resolve() : reject();
    });
  });
}

function killServerProcess(): Promise<void> {
  serverProcess.kill("SIGINT");
  return new Promise((resolve) => serverProcess.once("exit", () => resolve()));
}
