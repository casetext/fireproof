
'use strict';

var Fireproof = require('./lib/core');
require('./lib/stats')(Fireproof);
require('./lib/snapshot')(Fireproof);
require('./lib/query')(Fireproof);
require('./lib/read')(Fireproof);
require('./lib/write')(Fireproof);
require('./lib/on-disconnect')(Fireproof);
require('./lib/auth')(Fireproof);
require('./lib/user')(Fireproof);

module.exports = Fireproof;
