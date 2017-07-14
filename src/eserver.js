const fs = require('fs');
const path = require('path');
const https = require('https');
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors')
const json2csv = require('json2csv');
const config = require('./config');

const breifSearchRoute = '/api/:requestText'; // POST
const setFullNameRoute = '/api/setFullName/:requestText'; // POST
const getNextProfileUrlRoute = '/api/getNextProfileUrl/:requestText'; // GET

const options = {
  key: fs.readFileSync(config.ssl.key),
  cert: fs.readFileSync(config.ssl.cert),
};

app.use(cors());
app.use(bodyParser.json());

const server = https.createServer(options, app)
  .listen(config.port, function(){
    console.log('Listening route: \'%s\' at port: %d', breifSearchRoute, config.port);
  });

app.get(breifSearchRoute, (req, res) => {
  res.send('Use POST method.');
});

app.get(setFullNameRoute, (req, res) => {
  res.send('Use POST method.');
});


const requests = [];
const fieldNames = [
  'name',
  'title',
  'profileUrl',
  'photoUrl',
  'rate',
  'totalEarned',
];

app.post(breifSearchRoute, (req, res) => {
  console.log(req.body.page);

  let areDataShouldBeAdded = false;
  if (requests.hasOwnProperty(req.params.requestText)) {
    if (!requests[req.params.requestText].includes(req.body.page)) {
      requests[req.params.requestText].push(req.body.page);
      areDataShouldBeAdded = true;
    }
  } else {
    requests[req.params.requestText] = [];
    requests[req.params.requestText].push(req.body.page);
    areDataShouldBeAdded = true;
  }

  if (areDataShouldBeAdded) {
    const fullNameJson = path.join(config.outFolder, `${req.params.requestText}.json`);
    const fullNameCsv = path.join(config.outFolder, `${req.params.requestText}.csv`);

    let jsonDb = [];
    if (fs.existsSync(fullNameJson)) {
      jsonDb = JSON.parse(fs.readFileSync(fullNameJson));
    }

    if (req.body.records !== null) {
      req.body.records.forEach((item) => {
        console.log(item);
        jsonDb.push(item);
      });
    }

    fs.writeFileSync(fullNameJson, JSON.stringify(jsonDb, null, 2));
    fs.writeFileSync(fullNameCsv, json2csv({ data: jsonDb, fields: fieldNames })
    );
  }

  console.log('Ok');
  res.sendStatus(200);
});

const gen = [];
app.get(getNextProfileUrlRoute, (req, res) => {
  if (gen[req.params.requestText] == null) {
    gen[req.params.requestText] = profileUrlGenerator(req.params.requestText);
  }

  let genResult = gen[req.params.requestText].next();

  console.log(genResult);
  res.json(genResult);
});

function* profileUrlGenerator(requestText) {
  const fullNameJson = path.join(config.outFolder, `${requestText}.json`);
  const fullNameJsonFN = path.join(config.outFolder, `${requestText}_FN.json`);

  let jsonDb = [];
  if (fs.existsSync(fullNameJsonFN)) {
    jsonDb = JSON.parse(fs.readFileSync(fullNameJsonFN));
  } else if (fs.existsSync(fullNameJson)) {
    jsonDb = JSON.parse(fs.readFileSync(fullNameJson));
  }

  for (let key in jsonDb) {
    if (jsonDb[key].name.split(' ')[1].length === 2 &&
      jsonDb[key].name.split(' ')[1][1] === '.') {
      yield jsonDb[key].profileUrl;
    }
  }
}

app.post(setFullNameRoute, (req, res) => {
  console.log(req.body);

  const fullNameJson = path.join(config.outFolder, `${req.params.requestText}.json`);
  const fullNameJsonFN = path.join(config.outFolder, `${req.params.requestText}_FN.json`);
  const fullNameCsvFN = path.join(config.outFolder, `${req.params.requestText}_FN.csv`);

  let jsonOutDb;
  if (fs.existsSync(fullNameJsonFN)) {
    jsonOutDb = JSON.parse(fs.readFileSync(fullNameJsonFN));
  } else {
    jsonOutDb = JSON.parse(fs.readFileSync(fullNameJson));
  }

  console.log(req.body.profileUrl);

  const reqHash = req.body.profileUrl.split('/_~')[1];

  if (req.body.name != null) {
    let isDataChanged = false;
    for (let key in jsonOutDb) {
      let dbHash = jsonOutDb[key].profileUrl.split('/~')[1];

      if (dbHash === reqHash || `${dbHash}/` === reqHash) {
        jsonOutDb[key].name = req.body.name;
        isDataChanged = true;
        break;
      }
    }

    if (isDataChanged) {
      fs.writeFileSync(fullNameJsonFN, JSON.stringify(jsonOutDb, null, 2));
      fs.writeFileSync(fullNameCsvFN, json2csv({ data: jsonOutDb, fields: fieldNames }));
    }
  }

  console.log('Ok');
  res.sendStatus(200);
});

