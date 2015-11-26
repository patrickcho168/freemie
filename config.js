'use strict';


module.exports = {
  port: process.env.PORT || 8080,

  // Secret is used by sessions to encrypt the cookie.
  secret: 'freemienvc',

  // This is the id of your project in the Google Developers Console.
  gcloud: {
    projectId: 'freemie-1112'
  },

  // The client ID and secret can be obtained by generating a new web
  // application client ID on Google Developers Console.
  oauth2: {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    redirectUrl: process.env.OAUTH2_CALLBACK ||
      'http://localhost:8080/oauth2callback',
    scopes: ['email', 'profile']
  },
};
