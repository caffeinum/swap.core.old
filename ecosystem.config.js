module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name            : 'alice',
      script          : './server/app.js',
      args            : '1234567890',
      node_args       : '--inspect=7077',
      watch           : true,
      ignore_watch    : ["node_modules", "storage", ".ipfs", ".git"],
      env             : {
        PORT : 7777,
      }
    },
    {
      name            : 'bob',
      script          : './server/app.js',
      args            : '9876543210',
      watch           : true,
      node_args       : '--inspect=8088',
      ignore_watch    : ["node_modules", "storage", ".ipfs", ".git"],
      env             : {
        PORT : 8888,
      }
    },
    {
      name            : 'api',
      script          : './server/app.js',
      args            : '',
      env             : {
        PORT : 1337,
      }
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
};
