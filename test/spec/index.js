
'use strict';

var Fireproof = require('../../index');

describe('Fireproof', function() {

  describe('constructor', function() {

    it('takes an ordinary Firebase instance', function() {

      var fireproof;
      expect(function() {
        fireproof = new Fireproof(firebase);
      }).not.to.Throw();

      expect(fireproof).to.be.an.instanceof(Fireproof);

    });

  });

});
