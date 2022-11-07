const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const pathLink = path.join(__dirname, 'files');
const newFolderLink = path.join(__dirname, 'new-folder');

fs.mkdir(newFolderLink, { recursive: true }, (err) => {
  if (err) {
    console.log(`Ошибка вида ${err.code}`);
  }
});

fs.readdir(newFolderLink, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    fs.unlink(path.join(newFolderLink, file), (err) => {
      if (err) throw err;
    });
  });
});

fsPromises
  .readdir(pathLink)
  .then((files) => {
    files.forEach((file) => {
      fsPromises.copyFile(
        path.join(pathLink, file),
        path.join(newFolderLink, file)
      );
      console.log(`Файл ${file} скопирован успешно`);
    });
  })
  .catch((err) => console.log(err.message));
