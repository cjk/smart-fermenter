import logger from 'debug';

const debug = logger('smt:fermenter:main');

// Allow for clean restarts (e.g. when using pm2 or other process managers)
const setupCleanClientDisconnectHandler = client => {
  process.on('SIGINT', () => {
    debug('Received SIGINT. Cleaning up and exiting...');
    client.close();
    process.exit();
  });
};

export { setupCleanClientDisconnectHandler };
