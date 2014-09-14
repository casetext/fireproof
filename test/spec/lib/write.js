
'use strict';

var Fireproof = require('../../../index').Fireproof,
  Q = require('kew');

Fireproof.bless(Q);


describe('write operation', function() {

  var fireproof;

  beforeEach(function() {
    fireproof = new Fireproof(firebase);
  });

  describe('#set', function() {

    it('promises to set the object to the given value', function() {

      var didSet;
      return expect(
        fireproof.child('test')
        .set(true, function(err) {
          didSet = (err === null);
        })
        .delay(10)
        .then(function() {
          expect(didSet).to.equal(true);
        }))
      .to.be.fulfilled;

    });

  });

  describe('#update', function() {

    it('promises to update the object to the given value', function() {

      var didUpdate;
      return expect(fireproof.child('thing')
      .update({ 'foo': 'bar' }, function(err) {
        didUpdate = (err === null);
      })
      .delay(10)
      .then(function() {
        expect(didUpdate).to.equal(true);
      })).to.be.fulfilled;

    });

  });

  describe('#remove', function() {

    it('promises to remove the object', function() {

      var didRemove;
      return expect(fireproof.remove(function(err) {
        didRemove = (err === null);
      })
      .delay(10)
      .then(function() {
        expect(didRemove).to.equal(true);
      })).to.be.fulfilled;

    });

  });

  describe('#push', function() {

    it('returns a Fireproof that promises to add the new child', function() {

      var didPush;

      var newProof = fireproof.child('list')
      .push({
        'foo': 'bar'
      }, function(err) {
        didPush = (err === null);
      });

      expect(newProof.constructor.name).to.equal('Fireproof');

      var testPromise = Q.resolve()
      .then(function() {
        return newProof;
      })
      .delay(50)
      .then(function() {
        expect(didPush).to.equal(true);
      });

      return expect(testPromise).to.be.fulfilled;

    });

  });

  describe('#setWithPriority', function() {

    it('promises to set the ref to the given value and priority', function() {

      var didSet;
      return expect(fireproof.child('test')
      .setWithPriority(true, 0, function(err) {
        didSet = (err === null);
      })
      .delay(50)
      .then(function() {
        expect(didSet).to.equal(true);
      })).to.be.fulfilled;

    });

  });

  describe('#setPriority', function() {

    it('promises to set the ref to the given priority', function() {

      var didSet;

      return expect(fireproof.child('test')
      .setPriority(1, function(err) {
        didSet = (err === null);
      })
      .delay(50)
      .then(function() {
        expect(didSet).to.equal(true);
      })).to.be.fulfilled;

    });

  });

});
