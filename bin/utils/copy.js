var fs = require("fs/promises");
var path = require("path");

/**
 * @description copy all content from source directory to target directory same.
 * fs.cp this should copy directorys but yells EISDIR because source is a directory ...
 */
module.exports = async function copyDirectory(from, to) {
  await fs.mkdir(to, { recursive: true });
  const files = await fs.readdir(from);

  for (const file of files) {
    if (file === "." || file === "..") {
      continue;
    }

    const source = path.join(from, file);
    const target = path.join(to, file);

    if ((await fs.stat(source)).isDirectory()) {
      await copyDirectory(source, target);
      continue;
    }

    await fs.copyFile(source, target);
  }
};
