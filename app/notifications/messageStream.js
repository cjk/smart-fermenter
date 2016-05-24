/* eslint no-console: "off" */

import Kefir from 'kefir';
import request from 'request';

const slackURL = 'https://hooks.slack.com/services/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';

function createMessageEmitter() {
  const postToSlack = (text) => {
    const payload = {text, channel: '#smarthome', username: 'fermenter-closet'};

    request.post(slackURL, {body: payload, json: true}, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log(`[notification-response]: ${body}`);
      } else {
        console.log(`[notification-response] - ERROR - code: ${response.statusCode} - `, body);
      }
    });
  };

  let emitter;

  const stream = Kefir.stream((_emitter) => {
    emitter = _emitter;
    return () => {
      emitter = undefined;
    };
  });

  stream.emit = (text) => {
    emitter && emitter.emit(text);
    return this;
  };

  /* Send notifications via console / messenger (e.g. Slack). Never send more
     than one message in five seconds to avoid spamming. */
  stream.throttle(5000)
        .onValue((notification) => {
          console.log(`~~~~~~~ SENDING NOTIFICATION [${notification.level}]: ${notification.msg}`);
          //postToSlack(text);
        });
  return stream;
}

export default createMessageEmitter;
