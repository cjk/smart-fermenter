import request from 'request';

const slackURL = 'https://hooks.slack.com/services/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';

const sendToSlackChannel = (text) => {
  const payload = {text: text, channel: '#smarthome', username: 'fermenter-closet'};

  request.post(slackURL, {body: payload, json: true}, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log(`[notification-response]: ${body}`);
    } else {
      console.log(`[notification-response] - ERROR - code: ${response.statusCode} - `, body);
    } ;
  });
};

export default sendToSlackChannel;
