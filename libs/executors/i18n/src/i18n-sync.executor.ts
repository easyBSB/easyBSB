import { ExecutorContext } from "@nrwl/devkit";
import { readdir, readFile, stat, writeFile } from "fs/promises";
import { EOL } from "os";
import { basename, extname, resolve } from "path";

export interface ExecutorResult {
  success: boolean;
}

interface I18NExecutorOptions {
  path: string;
}

interface I18NMetaData {
  fileName: string;
  filePath: string;
  content: Record<string, string> | null;
}

export default async function i18nExecutor(
  options: I18NExecutorOptions,
  context: ExecutorContext
): Promise<ExecutorResult> {
  const languages = await readdir(options.path);
  const langFiles: Map<string, I18NMetaData[]> = new Map();

  await Promise.all(languages.map((lang) => {
    const path = resolve(options.path, lang);
    return extractLangFiles(path)
      .then((files) => {
        // map all file streams to a promise and run paralell
        const data$ = files.map((file) => createI18NFileMetadata(resolve(path, file)));
        return Promise.all(data$).then((data) => { 
          langFiles.set(lang, data)
        });
      })
      .catch((file) => process.stdout.write(`ignore ${file} ${EOL}`));
  }));

  const bluePrints = createI18NBlueprint(langFiles);
  await syncI18NFiles(langFiles, bluePrints);
  
  return Promise.resolve({ success: true });
}

async function extractLangFiles(path: string): Promise<string[]> {
  const stats = await stat(path);
  if (stats.isDirectory()) {
    return extractJSONFiles(await readdir(path), path);
  }
  throw path;
}

/**
 * extract all JSON files from directory
 */
async function extractJSONFiles(files: string[], path: string): Promise<string[]> {
  const matchedFiles: string[] = []
  for (let file of files) {
    const filePath = resolve(path, file);
    const fileStat = await stat(filePath);

    // results in [core.json, core.json, not super cool maybe]
    if (fileStat.isFile() && extname(file).toLowerCase() === '.json') {
      matchedFiles.push(file)
    }
  }

  return matchedFiles;
}

/**
 * create meta data for every file for every language we have found
 * so we can combine them to 1 blueprint
 */
async function createI18NFileMetadata(path: string): Promise<I18NMetaData> {
  const metadata: I18NMetaData = {
    content: {},
    fileName: basename(path),
    filePath: path
  };

  try {
    metadata['content'] = JSON.parse(await readFile(path, { encoding: 'utf-8' }));
  } catch (error) {
    process.stderr.write(`Error reading JSON from ${path}` + EOL);
  }

  return metadata;
}

/**
 * creates a blueprint for all I18N files which is an combined Record of 
 * all Files we can find
 */
function createI18NBlueprint(languages: Map<string, I18NMetaData[]>): Map<string, Record<string, string>> {
  const metadata = Array.from(languages.values()).flat(2);
  const blueprints: Map<string, Record<string, string>> = new Map();

  for (let item of metadata) {
    const key = item.fileName;
    const blueprint = (blueprints.has(item.fileName) ? blueprints.get(key) : {}) ?? {};

    const blueprintContent = {}
    for (const key of Object.keys(item.content ?? {})) {
      blueprintContent[key] = key;
    }

    blueprints.set(key, Object.assign({}, blueprint, blueprintContent));
  }
  return blueprints;
}

/**
 * write all i18n files so they have all the same keys
 */
async function syncI18NFiles(
  languages: Map<string, I18NMetaData[]>,
  bluePrints: Map<string, Record<string, string>>
): Promise<void[]> {
  const metadata = Array.from(languages.values()).flat(2);
  const write$ = metadata.map((item) => {
    const blueprintKey = item.fileName;
    const filePath = item.filePath;
    const fileContent = item.content ?? {};
    const blueprintContent = bluePrints.get(blueprintKey) ?? {};
    const newContent = Object.assign({}, blueprintContent, fileContent);

    return writeFile(filePath, JSON.stringify(newContent, null, 2) + EOL)
      .catch(() => {
        process.stderr.write(`Could not write I18N ${filePath}` + EOL);
      })
    ;
  });

  return Promise.all(write$);
}