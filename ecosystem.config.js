module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'smthome-fermenter',
      script: './app/index.js',
      kill_timeout: 5000,
      wait_ready: true,
      env: {
        PORT: 8000,
        DEEPSTREAM_ADDR: 'localhost',
        DEEPSTREAM_PORT: 6020,
        DEBUG: 'smt:*,error,debug',
      },
      env_production: {
        PORT: 8000,
        NODE_ENV: 'production',
        DEEPSTREAM_ADDR: '192.168.1.28',
        DEEPSTREAM_PORT: 6020,
        DEBUG: 'smt:*,error',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'cjk',
      host: 'alarmpi',
      ref: 'origin/master',
      repo: 'git@github.com:cjk/smart-fermenter.git',
      path: '/home/cjk/proj/smarthome-fermenter',
      'post-deploy':
        'yarn install && yarn run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
