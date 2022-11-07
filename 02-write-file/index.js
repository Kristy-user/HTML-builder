const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');
let output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Какие у тебя задачи на сегодня?\n');

stdin.on('data', (data) => {
  let dataToString = data.toString();
  dataToString.trim() === 'exit'
    ? endWrite()
    : output.write(
        dataToString[0].toUpperCase() +
          dataToString.slice(1, dataToString.length - 1)
      );
});

process.on('SIGINT', endWrite);

function endWrite() {
  stdout.write('Все задачи записаны. \nХорошего дня:)');
  exit();
}
