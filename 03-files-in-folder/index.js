const fs = require('fs');
const path = require('path');
const pathLink = path.join(__dirname, 'secret-folder');

fs.readdir(pathLink, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file, i) => {
      if (!file.isDirectory()) {
        const filePath = path.join(__dirname, file.name);
        const fileName = file.name.split('.')[0];
        const ext = path.extname(filePath);
        fs.stat(
          path.join(__dirname, 'secret-folder', file.name),
          (error, stats) => {
            console.log(
              fileName,
              '-',
              ext.replace('.', ''),
              '-',
              stats.size / 1024 + ' Kb'
            );
          }
        );
      }
    });
  }
});
