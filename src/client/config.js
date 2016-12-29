const config = {
  /* NOTE for backend-host setting: zircon.local is not available on current HOME-LAN through mobile */

  // @if NODE_ENV='development'
  host: 'localhost',
  // @endif
  // @if NODE_ENV='production'
  host: '192.168.1.28',  /* eslint no-dupe-keys: "off" */
  // @endif
  port: 4001,
  namespace: 'fermenter'
};

export default config;
