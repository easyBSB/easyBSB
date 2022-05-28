import { ExecutorContext, runExecutor } from "@nrwl/devkit";

export default async function* runApiServer(context: ExecutorContext) {
  const executorOptions = {
    project: "server",
    target: "serve",
    configuration: "e2e",
  };

  for await (const output of await runExecutor<{
    success: boolean;
    path: string;
  }>(executorOptions, {}, context)) {
    if (!output.success) throw new Error("Could not compile application files");

    yield true;
  }
}
