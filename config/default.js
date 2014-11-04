'use strict';

module.exports = {
  auth0Domain: process.env.TC_AUTH0_DOMAIN || 'serenity-tc.auth0.com',
  auth0Client: process.env.TC_AUTH0_CLIENT || 'foo',
  auth0Secret: process.env.TC_AUTH0_SECRET || 'bar'
};
