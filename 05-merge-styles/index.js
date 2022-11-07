const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const copyPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function copyStyles(stylesPath) {
  try {
    const output = fs.createWriteStream(copyPath, 'utf-8');
    const files = await fsPromises.readdir(stylesPath, { withFileTypes: true });

    const filesForCopy = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css'
    );

    for (const file of filesForCopy) {
      const styleFile = await fsPromises.readFile(
        path.join(stylesPath, file.name),
        'utf-8'
      );
      output.write(`${styleFile}\n`);
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function buildCssFile() {
  try {
    await fsPromises.rm(copyPath, { force: true, recursive: true });
    await copyStyles(stylesPath);
    console.log('Файл bundle.css собран');
  } catch (err) {
    console.log(err.message);
  }
}

buildCssFile();
