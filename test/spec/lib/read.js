
'use strict';


var Fireproof = require('../../../index').Fireproof,
  Q = require('kew');

Fireproof.bless(Q);


describe('Fireproof', function() {

  var fireproof;

  beforeEach(function() {
    fireproof = new Fireproof(firebase);
  });

  describe('#transaction', function() {

    it('promises to run the transaction', function() {

      // FIXME(goldibex): test this

    });

  });

  describe('#on', function() {

    before(function() {

      return fireproof.child('onTest/foo')
      .setWithPriority('bar', 3)
      .then(function() {
        return fireproof.child('onTest/baz')
        .setWithPriority('quux', 5);
      });

    });

    it('promises to attach a listener to events on the ref', function() {

      var seenCount = 0;
      return expect(
        fireproof.child('onTest')
        .on('child_added', function() {
          seenCount++;
        })
        .then(function() {
          expect(seenCount).not.to.equal(0);
        })
      ).to.be.fulfilled;

    });

    it('rejects if access is denied to the given ref', function() {

      // FIXME(goldibex): test this

    });

  });

  // # off is untestable, as above

  describe('#once', function() {

    before(function() {

      return fireproof.child('onceTest/foo')
      .setWithPriority('bar', 3)
      .then(function() {
        return fireproof.child('onceTest/baz')
        .setWithPriority('quux', 5);
      });

    });

    it('promises to listen for exactly one event of the given type', function() {

      var name, value;
      return expect(
        fireproof.child('onceTest').once('child_added', function(snap) {
          name = snap.name();
          value = snap.val();
        })
        .then(function(snap) {
          return {
            name: snap.name(),
            value: snap.val()
          };
        })
      )
      .to.eventually.deep.equal({
        name: 'foo',
        value: 'bar'
      });

    });

  });

});
