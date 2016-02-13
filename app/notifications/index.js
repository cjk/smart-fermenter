import Kefir from 'kefir';
import request from 'request';

const slackURL = 'https://hooks.slack.com/services/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';

const sendThrottledMessage = (text) => {

  const postToSlack = (text) => {
    const payload = {text: text, channel: '#smarthome', username: 'fermenter-closet'};

    request.post(slackURL, {body: payload, json: true}, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log(`[notification-response]: ${body}`);
      } else {
        console.log(`[notification-response] - ERROR - code: ${response.statusCode} - `, body);
      };
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

  stream.throttle(3000)
        .onValue((text) => {
          console.log('~~~~~~~~~~~ SENDING NOTIFICATION: ', text);
          postToSlack(text);
        });
  return stream;
};

export default sendThrottledMessage;
