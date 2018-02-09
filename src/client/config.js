const config = {
  /* NOTE for backend-host setting: zircon.local is not available on current HOME-LAN through mobile */
  host: process.env.NODE_ENV === 'development' ? 'localhost' : '192.168.1.28',
  port: 6020,
  namespace: 'fermenter',
};

export default config;
