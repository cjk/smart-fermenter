/* eslint no-console: "off" */
import K from 'kefir';

const fermenterStartCmd = {'fermenter/command': 'none'};

function handleCommands(client) {
  const remoteCommand = client.record.getRecord('fermenter/command');

  const stream = K.stream((emitter) => {
    function emitCommand(cmd) {
      /* DEBUGGING */
      console.log(`[Fermenter-Cmd-Stream] Emitting fermenter command we just received: <${JSON.stringify(cmd)}>`);
      emitter.emit(cmd);
    }
    remoteCommand.subscribe(emitCommand);
  });
  return stream.toProperty(() => fermenterStartCmd);
}

export default handleCommands;
