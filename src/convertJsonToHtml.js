const fs = require('fs');
const path = require('path');
const config = require('./config');

const requestText = 'Taganrog';

const fullNameJsonFN = path.join(config.outFolder, `${requestText}_FN.json`);
const fullNameHtmlFN = path.join(config.outFolder, `${requestText}_FN.html`);

let jsonDb = [];
if (fs.existsSync(fullNameJsonFN)) {
  jsonDb = JSON.parse(fs.readFileSync(fullNameJsonFN));
}

let i = 0;
fs.appendFileSync(fullNameHtmlFN, '<table border="1" cellspacing="0" bordercolor="#a9a9a9">\n');
for (let key in jsonDb) {
  i++;
  fs.appendFileSync(fullNameHtmlFN, '<tr>\n');
  fs.appendFileSync(fullNameHtmlFN, `<td>${i}</td>\n`);
  fs.appendFileSync(fullNameHtmlFN, `<td>${jsonDb[key].name}</td>\n`);
  fs.appendFileSync(fullNameHtmlFN, `<td><img src="${jsonDb[key].photoUrl}" /></td>\n`);
  fs.appendFileSync(fullNameHtmlFN, `<td>${jsonDb[key].title}</td>\n`);
  fs.appendFileSync(fullNameHtmlFN, `<td><a href="${jsonDb[key].profileUrl}">profile</a></td>\n`);
  fs.appendFileSync(fullNameHtmlFN, `<td>${jsonDb[key].rate}</td>\n`);
  fs.appendFileSync(fullNameHtmlFN, `<td>${jsonDb[key].totalEarned}</td>\n`);
  fs.appendFileSync(fullNameHtmlFN, '</tr>\n');
}
fs.appendFileSync(fullNameHtmlFN, '</table>');




