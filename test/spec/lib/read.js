
'use strict';

var Q = require('kew');

var fireproof;

describe('Read operation', function() {

  describe('#transaction', function() {

    before(function() {

      fireproof = new Fireproof(root);

      // FIXME(goldibex): test this
      return fireproof
      .child('transactiontest')
      .set(true);

    });

    it('promises to run the transaction', function() {

      return fireproof.child('transactiontest')
      .transaction(function() {
        return 5;
      })
      .then(function(result) {

        expect(result.committed).to.equal(true);
        expect(result.snapshot.constructor.name).to.equal('FireproofSnapshot');
        expect(result.snapshot.val()).to.equal(5);

      });

    });

  });

  describe('#on', function() {

    before(function() {

      fireproof = new Fireproof(root);

      return Q.all([

        fireproof.child('onTest/foo')
        .setWithPriority('bar', 3),

        fireproof.child('onTest/baz')
        .setWithPriority('quux', 5)

      ]);

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

      fireproof = new Fireproof(root);

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
          name = snap.key();
          value = snap.val();
        })
        .then(function(snap) {
          return {
            name: snap.key(),
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
