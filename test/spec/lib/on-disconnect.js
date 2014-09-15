
'use strict';

var Fireproof = require('../../../index'),
  Firebase = require('firebase'),
  Q = require('kew');

Fireproof.bless(Q);


describe('onDisconnect', function() {

  var fireproof;

  beforeEach(function() {
    fireproof = new Fireproof(firebase);
  });


  describe('#set', function() {

    it('promises to set the ref to the specified value on disconnect', function() {

      return fireproof
      .child('odSet')
      .onDisconnect()
      .set(true)
      .then(function() {

        Firebase.goOffline();
        Firebase.goOnline();

        return fireproof.child('odSet');

      })
      .then(function(snap) {
        expect(snap.val()).to.equal(true);
      });

    });

  });


  describe('#remove', function() {

    it('promises to remove the data at specified ref on disconnect', function() {

      return fireproof
      .child('odSet')
      .onDisconnect()
      .remove()
      .then(function() {

        Firebase.goOffline();
        Firebase.goOnline();

        return fireproof.child('odSet');

      })
      .then(function(snap) {
        expect(snap.val()).to.equal(null);
      });

    });

  });


  describe('#setWithPriority', function() {

    it('promises to set the ref to a value/priority on disconnect', function() {

      return fireproof
      .child('odSet')
      .onDisconnect()
      .setWithPriority(true, 5)
      .then(function() {

        Firebase.goOffline();
        Firebase.goOnline();

        return fireproof.child('odSet');

      })
      .then(function(snap) {
        expect(snap.val()).to.equal(true);
        expect(snap.getPriority()).to.equal(5);
      });

    });

  });

  describe('#update', function() {

   it('promises to update the ref with the given values on disconnect', function() {

      return fireproof
      .child('odUpdate')
      .set({ foo: 'bar', baz: 'quux' })
      .then(function() {
        return fireproof
        .child('odUpdate')
        .onDisconnect()
        .update({ baz: 'bells', whistles: true });
      })
      .then(function() {

        Firebase.goOffline();
        Firebase.goOnline();

        return fireproof.child('odUpdate');

      })
      .then(function(snap) {
        expect(snap.val()).to.deep.equal({
          foo: 'bar',
          baz: 'bells',
          whistles: true
        });
      });

    });

  });


  describe('#cancel', function() {

   it('promises to cancel all onDisconnect operations at the ref', function() {

      return fireproof.child('odCancel')
      .onDisconnect().set({ foo: 'bar '})
      .then(function() {
        return fireproof.child('odCancel')
        .onDisconnect().cancel();
      })
      .then(function() {

        Firebase.goOffline();
        Firebase.goOnline();

        return fireproof.child('odCancel');

      })
      .then(function(snap) {
        expect(snap.val()).to.equal(null);
      });

    });

  });

});
