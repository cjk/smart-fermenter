import request from 'request';

const slackURL = 'https://hooks.slack.com/services/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';

const sendToSlackChannel = (text) => {
  const payload = {text: text, channel: '#smarthome', username: 'fermenter-closet'};

  const postToSlack = () => {
    request.post(slackURL, {body: payload, json: true}, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log(`[notification-response]: ${body}`);
      } else {
        console.log(`[notification-response] - ERROR - code: ${response.statusCode} - `, body);
      };
    });
  };

  const simLater = (cb => {
    setTimeout(() => console.log(`~~~~ ${text}~~~~`), 1000);
  });

  const postLater = (cb => {
    setTimeout(() => postToSlack(), 1000);
  });

  console.log('~~~~~~~~~~~ NOTIFICATION RECEIVED ~~~~~~~~~~');
  return simLater();
};

export default sendToSlackChannel;
