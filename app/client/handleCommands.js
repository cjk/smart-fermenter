function handleCommands(fermenterSocket) {
  const performCommand = (cmd) => {
    console.log(`~~ Received a remote-command: <${JSON.stringify(cmd)}>`);
    /* TODO: Backend isn't listening to command-replies yet?! */
    //return fermenterSocket.emit('fermenterCommand', {status: 'done'});
  };

  console.log('~~ Starting listening to fermenter-commands...');

  fermenterSocket.on('fermenterCmd', (cmd) => {
    performCommand(cmd);
  });

  fermenterSocket.on('disconnect', () => {
    console.log('~~ Stopped listening to fermenter-commands.');
  });
}

export default handleCommands;
