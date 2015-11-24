// Copyright 2015, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
