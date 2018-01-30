const https = require('https');
const EventEmitter = require('events');
const creds = require('./token.json');
const uniqBy = require('lodash/uniqBy');

class myEventEmitter extends EventEmitter {}

const emitter = new myEventEmitter();
const { url, chatId, token } = creds;

function get() {
  console.log('!!!');
  https.get(`${url}liveChatId=${chatId}&key=${token}`, response => {
    let data = '';

    response.on('data', row => (data += row));
    response.on('end', () => {
      const dataObj = JSON.parse(data);
      const messages = dataObj.items.map(i => i.snippet).reverse();
      const uniqMessage = uniqBy(messages, 'authorChannelId');

      const voteResult = uniqMessage
        .map(i => i.textMessageDetails.messageText)
        .reduce(
          (memo, message) => {
            const yes = message.search('yes') === 0;
            const no = message.search('no') === 0;

            return {
              yes: yes ? memo.yes + 1 : memo.yes,
              no: no ? memo.no + 1 : memo.no,
            };
          },
          { yes: 0, no: 0 },
        );

      emitter.emit('vote', voteResult);
    });
  });
}

setInterval(get, 500);

module.exports = emitter;
