const { error } = require('console');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const componentsFolderPath = path.join(__dirname, 'components');
const buildFolderPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');

function createAsyncFolder(path) {
  try {
    return fsPromises.mkdir(path, { recursive: true });
  } catch (err) {
    console.log(err.message);
  }
}

async function readFileAsync(path) {
  try {
    let data = fsPromises.readFile(path, { encoding: 'utf-8' });
    return data;
  } catch (err) {
    console.log(err.message);
  }
}

async function createHtmlFile() {
  try {
    const templateFile = await fsPromises.readFile(
      path.join(__dirname, 'template.html')
    );
    let templateContent = templateFile.toString();
    const componentsFiles = await fsPromises.readdir(componentsFolderPath, {
      withFileTypes: true,
    });

    let componentsFilesForTemplate = componentsFiles
      .map((file) => file.name)
      .filter((name) =>
        templateContent.includes(`{{${name.replace('.html', '')}}}`)
      );

    for await (const component of componentsFilesForTemplate) {
      const componentName = component.replace('.html', '');
      const componentFile = await fsPromises.readFile(
        path.join(componentsFolderPath, component)
      );
      templateContent = templateContent.replace(
        `{{${componentName}}}`,
        componentFile.toString()
      );
    }
    await fsPromises.writeFile(
      path.join(buildFolderPath, 'index.html'),
      templateContent
    );
  } catch (err) {
    console.log(err.message);
  }
}

async function copyStyles(stylesPath) {
  try {
    const output = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css'),
      'utf-8'
    );
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
const getFileList = (filePath, copyPath) =>
  new Promise((resolve, reject) => {
    fs.readdir(filePath, { withFileTypes: true }, (err, files) => {
      if (err) return reject(err.message);
      files.forEach((dir) => {
        if (dir.isDirectory())
          copyFolder(
            path.join(filePath, dir.name),
            path.join(copyPath, dir.name)
          );
      });
      let fileLists = files
        .filter((file) => file.isFile())
        .map((file) => file.name);
      resolve(fileLists);
    });
  });

const copyFile = (copyFile, copyPath) => {
  let fileName = path.basename(copyFile);
  const input = fs.createReadStream(copyFile);
  const output = fs.createWriteStream(path.join(copyPath, fileName));
  input.pipe(output);
  input.on('error', (err) => console.error(err.message));
};

const copyFolder = (filesPath, copyPath) => {
  createAsyncFolder(copyPath)
    .then(() => getFileList(filesPath, copyPath))
    .then((fileLists) =>
      fileLists.forEach((file) => {
        copyFile(path.join(filesPath, file), copyPath);
      })
    )

    .catch((err) => console.error(err));
};

async function buildProject() {
  try {
    await fsPromises.rm(buildFolderPath, { force: true, recursive: true });
    await createAsyncFolder(buildFolderPath);
    await createHtmlFile();
    await copyStyles(stylesPath);
    copyFolder(
      path.join(__dirname, 'assets'),
      path.join(buildFolderPath, 'assets')
    );
    console.log('Проект собран');
  } catch (err) {
    console.log(err.message);
  }
}

buildProject();
