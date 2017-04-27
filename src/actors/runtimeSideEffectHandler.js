/* Runtime notification handler - sends all collected message-events out as
   notifications */
import {
  createMessageEmitter,
  buildEmergencyNotifications,
} from '../notifications';

const messageEmitter = createMessageEmitter();

function sendNotifications(notLst) {
  /* Send all messages as notifications in reverse-chronological order
     (first-in-first-out) */
  const queue = notLst.toSeq().reverse().values();

  let notification;
  while (!(notification = queue.next()).done) {
    messageEmitter.emit(notification.value);
  }
}

function handleRuntime(state) {
  const rts = state.get('rts');
  const notifications = buildEmergencyNotifications(rts).concat(
    rts.get('notifications')
  );
  /* Send notifications from queue */
  sendNotifications(notifications);
}

export default handleRuntime;
