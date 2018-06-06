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
      watch           : true,
      env             : {
        PORT : 7777,
        DEBUG_PORT: 7077,
      }
    },
    {
      name            : 'bob',
      script          : './server/app.js',
      args            : '9876543210',
      watch           : true,
      env             : {
        PORT : 8888,
        DEBUG_PORT: 8088,
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
