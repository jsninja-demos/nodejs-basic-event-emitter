const http = require('http');
const fs = require('fs');
const utils = require('util');
const template = require('lodash/template');
const answerHelper = require('./utils/answer');
const emitter = require('./emitter');

const readFs = utils.promisify(fs.readFile);

const question = process.argv[2];

let yes = 0;
let no = 0;
let noHeight = 35;
let yesHeight = 35;

async function start() {
  const templateStr = await readFs('./html/index.html', 'utf8');
  const compiler = template(templateStr);

  let params = { yes, no, question, noHeight, yesHeight };

  emitter.on('vote', voteResult => {
    yes = voteResult.yes;
    no = voteResult.no;
    params = { yes, no, question, ...answerHelper.formatAnswer(yes, no) };
  });

  emitter.on('error', err => {
    console.log('error', 'some error');
  });

  const server = http.createServer((req, res) => {
    const htmlString = compiler(params);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(htmlString);
    res.end();
  });

  server.listen(8000, () => console.log('works', 8000));
}
start();
