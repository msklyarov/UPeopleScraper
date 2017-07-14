const fs = require('fs');
const path = require('path');
const config = require('./config');

const requestText = 'Taganrog';

const fullNameJsonFN = path.join(config.outFolder, `${requestText}_FN.json`);
const fullNameJsonFNOut = path.join(config.outFolder, `${requestText}_FN_out.json`);

let jsonDb = [];
if (fs.existsSync(fullNameJsonFN)) {
  jsonDb = JSON.parse(fs.readFileSync(fullNameJsonFN));
}

let jsonOutDb = [];

for (let i = 0; i < jsonDb.length; i++) {
  for (let j = jsonDb.length - 1; j > i; j--) {
    if (jsonDb[i].profileUrl === jsonDb[j].profileUrl) {
      jsonDb.splice(j, 1);
    }
  }
}

fs.writeFileSync(fullNameJsonFNOut, JSON.stringify(jsonDb, null, 2));
