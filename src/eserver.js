const fs = require('fs');
const path = require('path');
const https = require('https');
const app = require('express')();
const bodyParser = require('body-parser');
const json2csv = require('json2csv');
const config = require('./config');

const breifSearchRoute = '/api/:requestText';

const options = {
  key: fs.readFileSync(config.ssl.key),
  cert: fs.readFileSync(config.ssl.cert),
};

app.use(bodyParser.json());

const server = https.createServer(options, app)
  .listen(config.port, function(){
    console.log('Listening route: \'%s\' at port: %d', breifSearchRoute, config.port);
  });

app.get(breifSearchRoute, function(req, res) {
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

app.post(breifSearchRoute, function(req, res) {

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
