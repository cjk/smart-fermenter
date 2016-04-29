import R from 'ramda';

function handleCommands(io) {
  const performCommand = (cmd) => {
    console.log(`~~ Received a remote-command: <${cmd}>`);
    /* TODO: Backend isn't listening to command-replies yet?! */
    return io.emit('fermenterCommand', {status: 'done'});
  };

  io.on('connection', (socket) => {
    console.log('~~ Starting listening to fermenter-commands...');

    socket.on('fermenterCommand', (cmd) => {
      performCommand(cmd);
    });

    socket.on('disconnect', () => {
      console.log('~~ Stopped listening to fermenter-commands.');
    });
  });
}

export default handleCommands;
