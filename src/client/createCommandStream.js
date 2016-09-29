/* eslint no-console: "off" */
import K from 'kefir';

const fermenterStartCmd = {fermenterCmd: 'fermenterStart'};

function handleCommands(fermenterSocket) {
  function disconnectHndlr() {
    /* PENDING: Disconnects are happening, thus do something useful here, like
       emitting an error?! */
    console.log('[CommandHdlr] Disconnected - stopped listening to fermenter-commands.');
  }

  const stream = K.stream((emitter) => {
    function emitCommand(cmd) {
      /* DEBUGGING */
      // console.log(`[Fermenter-Cmd-Stream] Emitting fermenter command we just received: <${JSON.stringify(cmd)}>`);
      emitter.emit(cmd);
    }

    fermenterSocket.removeListener('fermenterCmd', emitCommand);
    fermenterSocket.on('fermenterCmd', emitCommand);

    fermenterSocket.on('disconnect', disconnectHndlr);

    /* PENDING: Not verified this actually works as expected :-) */
    return () => {
      fermenterSocket.removeListener('fermenterCmd', emitCommand);
      fermenterSocket.removeListener('disconnect', disconnectHndlr);
    };
  });
  return stream.toProperty(() => fermenterStartCmd);
}

export default handleCommands;
