
'use strict';

var Fireproof = require('./lib/fireproof');
require('./lib/query')(Fireproof);
require('./lib/read')(Fireproof);
require('./lib/write')(Fireproof);
require('./lib/onDisconnect')(Fireproof);

module.exports = {
  Fireproof: Fireproof,
  FireproofSimpleLogin: require('./lib/FireproofSimpleLogin')
};
