
'use strict';

var Q = require('kew');

describe('auth method', function() {

  var fireproof;
  beforeEach(function() {
    fireproof = new Fireproof(firebase);
  });

  describe('#authWithCustomToken', function() {

    it('works okay with multiple simultaneous attempts', function() {

      return Q.all([
        fireproof.authWithCustomToken(process.env.FIREBASE_TEST_SECRET),
        fireproof.authWithCustomToken(process.env.FIREBASE_TEST_SECRET),
        fireproof.authWithCustomToken(process.env.FIREBASE_TEST_SECRET)
      ]);

    });

    it('passes failures through correctly', function() {

      return fireproof.authWithCustomToken('wrong')
      .then(function() {
        throw new Error('Should not have gotten here!');
      }, function(err) {});

    });

  });

});
