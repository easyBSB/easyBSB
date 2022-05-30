var fs = require("fs/promises");
var url = require("url");

/**
 * @description copy all content from source directory to target directory same.
 * fs.cp this should copy directorys but yells EISDIR because source is a directory ...
 */
module.exports = async function loadJSON(path) {
  const fileStats = await fs.stat(path);

  if (!fileStats.isFile()) {
    throw new Error(`${path} is not a valid json file`);
  }

  // for node 17 we can use the url with import assert
  const fileUrl = url.pathToFileURL(path);
  return JSON.parse(await fs.readFile(fileUrl, { encoding: "utf-8" }));
};
