import R from 'ramda';
import { Record } from 'immutable';

const Message = Record({
  level: 'notice',
  msg: 'Some notification-message',
});

function messageIsEmpty(message) {
  return (
    !(message instanceof Message) ||
    R.isNil(message.msg) ||
    R.isEmpty(message.msg)
  );
}

function queueMessage(runtimeState, message) {
  /* Do nothing on empty messages */
  if (messageIsEmpty(message)) {
    return runtimeState;
  }

  return runtimeState.update('notifications', msgLst =>
    msgLst.unshift(message)
  );
}

function buildMessage(msg, level = 'notify') {
  return new Message({ level, msg });
}

const createNotifier = R.curry(queueMessage);

export { buildMessage, createNotifier };
