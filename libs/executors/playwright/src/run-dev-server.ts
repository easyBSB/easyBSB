import { ExecutorContext, runExecutor } from "@nrwl/devkit";

export default async function* runDevServer(context: ExecutorContext) {
  const executorOptions = {
    project: "easybsb-client",
    target: "serve",
    configuration: "development",
  };

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
  }>(executorOptions, {}, context)) {
    if (!output.success) throw new Error("Could not compile application files");

    yield output.baseUrl;
  }
}
